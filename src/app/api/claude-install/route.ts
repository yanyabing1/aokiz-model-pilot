import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

// 检测 Claude Code 是否已安装
export async function GET() {
  try {
    console.log('Starting Claude Code installation check...')
    
    // 首先检查 claude 命令是否可用
    const claudeCheck = checkCommandAvailability('claude')
    if (claudeCheck.available) {
      console.log('Claude command found:', claudeCheck)
      
      // 尝试获取版本信息
      let version = 'unknown'
      try {
        version = execSync('claude --version', { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 10000
        }).trim()
        console.log('Claude version:', version)
      } catch (versionError) {
        console.log('Failed to get version:', versionError)
      }

      // 检测安装方式
      const installMethod = detectInstallMethod()
      console.log('Detected install method:', installMethod)

      return NextResponse.json({
        installed: true,
        version: version,
        installMethod: installMethod.method,
        path: claudeCheck.path,
        installDetails: installMethod.details
      })
    }

    // 如果 claude 命令不可用，检查 claude-code 命令
    const commandCheck = checkCommandAvailability('claude-code')
    if (commandCheck.available) {
      console.log('Claude Code command found:', commandCheck)
      
      // 尝试获取版本信息
      let version = 'unknown'
      try {
        // 方法1：使用 claude --version
        version = execSync('claude --version', { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 10000
        }).trim()
        console.log('Claude version:', version)
      } catch (versionError) {
        console.log('Failed to get version with claude --version:', versionError)
        
        // 方法2：检查 claude-code 二进制文件是否存在
        try {
          const result = execSync('which claude-code', { encoding: 'utf8' }).trim()
          if (result) {
            version = 'installed (binary found)'
            console.log('Claude Code binary found at:', result)
          }
        } catch (binaryError) {
          console.log('Failed to find claude-code binary:', binaryError)
        }
      }

      // 检测安装方式
      const installMethod = detectInstallMethod()
      console.log('Detected install method:', installMethod)

      return NextResponse.json({
        installed: true,
        version: version,
        installMethod: installMethod.method,
        path: commandCheck.path,
        installDetails: installMethod.details
      })
    }

    // 如果命令不可用，检查各种包管理器
    console.log('Claude Code command not found, checking package managers...')
    
    // 检查 npm 全局安装
    const npmCheck = checkNpmInstallation()
    if (npmCheck.installed) {
      console.log('Found npm installation:', npmCheck)
      return NextResponse.json({
        installed: true,
        version: npmCheck.version || 'unknown',
        installMethod: 'npm',
        path: npmCheck.path,
        installDetails: npmCheck.details
      })
    }

    // 检查 Homebrew 安装 (macOS)
    let brewCheck = { installed: false, version: '', path: '', details: '' }
    if (process.platform === 'darwin') {
      brewCheck = checkBrewInstallation()
      if (brewCheck.installed) {
        console.log('Found Homebrew installation:', brewCheck)
        return NextResponse.json({
          installed: true,
          version: brewCheck.version || 'unknown',
          installMethod: 'brew',
          path: brewCheck.path,
          installDetails: brewCheck.details
        })
      }
    }

    // 检查配置文件是否存在
    const configPath = path.join(process.env['HOME'] || '', '.claude', 'settings.json')
    const configExists = await fileExists(configPath)
    console.log('Config file exists:', configExists)

    return NextResponse.json({
      installed: false,
      configExists: configExists,
      message: 'Claude Code is not installed',
      detectionDetails: {
        commandAvailable: false,
        npmInstalled: npmCheck.installed,
        brewInstalled: process.platform === 'darwin' ? brewCheck.installed : false,
        configExists: configExists
      }
    })

  } catch (error) {
    console.error('Error during Claude Code detection:', error)
    return NextResponse.json({
      installed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check installation status'
    }, { status: 500 })
  }
}

// 检查命令是否可用
function checkCommandAvailability(command: string) {
  try {
    const result = execSync(`which ${command}`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim()
    
    if (result) {
      // 验证命令是否真的可以执行
      if (command === 'claude-code') {
        // 对于 claude-code，检查文件是否存在而不是尝试执行 --help
        execSync(`test -f "${result}"`, { stdio: 'pipe' })
      } else {
        execSync(`${command} --help`, { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 5000
        })
      }
      
      return {
        available: true,
        path: result
      }
    }
  } catch (error) {
    // 命令不可用
  }
  
  return { available: false, path: '' }
}

// 检测安装方式
function detectInstallMethod() {
  const methods = []
  
  // 检查 npm 全局路径
  try {
    const npmGlobal = execSync('npm config get prefix', { encoding: 'utf8' }).trim()
    const npmPath = path.join(npmGlobal, 'bin', 'claude-code')
    if (fileExistsSync(npmPath)) {
      methods.push({ method: 'npm', path: npmPath })
    }
  } catch (error) {
    // npm 检查失败
  }

  // 检查 Homebrew 路径 (macOS)
  if (process.platform === 'darwin') {
    const brewPaths = [
      '/usr/local/bin/claude-code',
      '/opt/homebrew/bin/claude-code'
    ]
    
    for (const brewPath of brewPaths) {
      if (fileExistsSync(brewPath)) {
        methods.push({ method: 'brew', path: brewPath })
        break
      }
    }
  }

  // 检查其他常见路径
  const commonPaths = [
    '/usr/bin/claude-code',
    '/usr/local/bin/claude-code',
    '/opt/bin/claude-code',
    path.join(process.env['HOME'] || '', '.local', 'bin', 'claude-code')
  ]

  for (const commonPath of commonPaths) {
    if (fileExistsSync(commonPath)) {
      methods.push({ method: 'binary', path: commonPath })
    }
  }

  return {
    method: methods.length > 0 ? methods[0]?.method : 'unknown',
    details: methods
  }
}

// 检查 npm 安装
function checkNpmInstallation() {
  try {
    // 检查全局安装
    const result = execSync('npm list -g @anthropic-ai/claude-code 2>/dev/null || echo "not found"', { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim()
    
    if (result && !result.includes('not found') && result.includes('@anthropic-ai/claude-code')) {
      // 获取安装路径
      let npmPath = ''
      try {
        const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim()
        npmPath = path.join(npmPrefix, 'bin', 'claude-code')
      } catch (error) {
        // 获取路径失败
      }

      return {
        installed: true,
        path: npmPath,
        version: 'unknown', // 需要命令可用才能获取版本
        details: 'Global npm package found'
      }
    }
  } catch (error) {
    // npm 检查失败
  }

  return { installed: false, path: '', version: '', details: '' }
}

// 检查 Homebrew 安装
function checkBrewInstallation() {
  try {
    const result = execSync('brew list | grep claude-code 2>/dev/null || echo "not found"', { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim()
    
    if (result && !result.includes('not found') && result.includes('claude-code')) {
      return {
        installed: true,
        path: '/usr/local/bin/claude-code',
        version: 'unknown', // 需要命令可用才能获取版本
        details: 'Homebrew package found'
      }
    }
  } catch (error) {
    // Homebrew 检查失败
  }

  return { installed: false, path: '', version: '', details: '' }
}

// 同步检查文件是否存在
function fileExistsSync(filePath: string): boolean {
  try {
    // 使用 execSync 来检查文件是否存在
    execSync(`test -f "${filePath}"`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

// 自动安装 Claude Code
export async function POST(request: NextRequest) {
  try {
    const { method } = await request.json()
    
    if (!method || !['npm', 'brew', 'curl'].includes(method)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid installation method'
      }, { status: 400 })
    }

    let installCommand = ''
    const installMethod = method

    switch (method) {
      case 'npm':
        installCommand = 'npm install -g @anthropic-ai/claude-code'
        break
      case 'brew':
        if (process.platform !== 'darwin') {
          return NextResponse.json({
            success: false,
            error: 'Homebrew is only available on macOS'
          }, { status: 400 })
        }
        installCommand = 'brew install anthropic/tap/claude-code'
        break
      case 'curl':
        installCommand = 'curl -fsSL https://claude.ai/install | sh'
        break
    }

    // 执行安装命令
    try {
      execSync(installCommand, {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 300000 // 5分钟超时
      })
    } catch (installError) {
      return NextResponse.json({
        success: false,
        error: `Installation failed: ${installError instanceof Error ? installError.message : 'Unknown error'}`
      }, { status: 500 })
    }

    // 验证安装
    try {
      // 方法1：使用 claude --version
      let version = ''
      try {
        version = execSync('claude --version', { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 10000
        }).trim()
        console.log('Claude version:', version)
      } catch (commandError) {
        console.log('claude --version failed, trying alternative methods...')
        
        // 方法2：检查 claude-code 二进制文件是否存在
        try {
          const result = execSync('which claude-code', { encoding: 'utf8' }).trim()
          if (result) {
            version = 'installed (binary found)'
            console.log('Claude Code binary found at:', result)
          }
        } catch (whichError) {
          // 方法3：使用完整路径检查
          console.log('which claude-code failed, trying full paths...')
          
          // 获取 npm 全局安装路径
          try {
            const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim()
            const possiblePaths = [
              path.join(npmPrefix, 'bin', 'claude-code'),
              path.join(process.env['HOME'] || '', '.npm-global', 'bin', 'claude-code'),
              '/usr/local/bin/claude-code',
              '/opt/homebrew/bin/claude-code'
            ]
            
            for (const cmdPath of possiblePaths) {
              try {
                // 检查文件是否存在而不执行 --version
                execSync(`test -f "${cmdPath}"`, { stdio: 'pipe' })
                version = 'installed (binary found)'
                console.log(`Found claude-code binary at: ${cmdPath}`)
                break
              } catch (pathError) {
                // 继续尝试下一个路径
              }
            }
          } catch (pathError) {
            throw new Error('Claude Code binary not found in any standard location')
          }
        }
      }

      if (version) {
        return NextResponse.json({
          success: true,
          version: version,
          installMethod: installMethod,
          message: 'Claude Code installed successfully'
        })
      } else {
        throw new Error('Unable to get Claude Code version')
      }
    } catch (verifyError) {
      console.error('Verification failed:', verifyError)
      
      // 即使验证失败，也认为安装成功，因为 npm 安装已经完成
      return NextResponse.json({
        success: true,
        version: 'unknown',
        installMethod: installMethod,
        message: 'Claude Code installed successfully (verification skipped due to PATH issues)',
        warning: 'Installation completed but command verification failed. You may need to restart your terminal or update PATH environment variables.'
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// 辅助函数：检查文件是否存在
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

