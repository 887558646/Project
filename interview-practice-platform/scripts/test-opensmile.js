#!/usr/bin/env node

/**
 * OpenSMILE集成测试脚本
 * 用于验证OpenSMILE是否正确安装和配置
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// 配置
const OPENSMILE_BINARY = process.env.OPENSMILE_BINARY || 'SMILExtract';
const OPENSMILE_CONFIG = process.env.OPENSMILE_CONFIG || path.join(__dirname, '../config/opensmile/speech_analysis.conf');
const TEST_AUDIO = path.join(__dirname, '../public/test-audio.wav');

async function testOpenSMILE() {
  console.log('🧪 OpenSMILE集成测试开始...\n');

  // 1. 检查OpenSMILE二进制文件
  console.log('1️⃣ 检查OpenSMILE二进制文件...');
  try {
    await execAsync(`${OPENSMILE_BINARY} -h`);
    console.log('✅ OpenSMILE二进制文件可用\n');
  } catch (error) {
    console.log('❌ OpenSMILE二进制文件不可用');
    console.log('请确保OpenSMILE已正确安装并添加到PATH中');
    console.log('或设置OPENSMILE_BINARY环境变量\n');
    return false;
  }

  // 2. 检查配置文件
  console.log('2️⃣ 检查配置文件...');
  try {
    await fs.access(OPENSMILE_CONFIG);
    console.log('✅ 配置文件存在:', OPENSMILE_CONFIG, '\n');
  } catch (error) {
    console.log('❌ 配置文件不存在:', OPENSMILE_CONFIG);
    console.log('请确保配置文件路径正确\n');
    return false;
  }

  // 3. 检查FFmpeg
  console.log('3️⃣ 检查FFmpeg...');
  try {
    await execAsync('ffmpeg -version');
    console.log('✅ FFmpeg可用\n');
  } catch (error) {
    console.log('❌ FFmpeg不可用');
    console.log('请安装FFmpeg用于音频格式转换\n');
    return false;
  }

  // 4. 创建测试音频文件（如果不存在）
  console.log('4️⃣ 准备测试音频文件...');
  try {
    await fs.access(TEST_AUDIO);
    console.log('✅ 测试音频文件存在\n');
  } catch (error) {
    console.log('⚠️ 测试音频文件不存在，生成静音测试文件...');
    try {
      // 生成1秒的静音WAV文件用于测试
      await execAsync(`ffmpeg -f lavfi -i "anullsrc=r=16000:cl=mono" -t 1 -y "${TEST_AUDIO}"`);
      console.log('✅ 测试音频文件已生成\n');
    } catch (genError) {
      console.log('❌ 无法生成测试音频文件');
      return false;
    }
  }

  // 5. 运行OpenSMILE分析测试
  console.log('5️⃣ 运行OpenSMILE分析测试...');
  const tempDir = path.join(__dirname, '../temp/opensmile-test');
  await fs.mkdir(tempDir, { recursive: true });
  
  const outputFile = path.join(tempDir, 'test-output.csv');
  const command = `"${OPENSMILE_BINARY}" -C "${OPENSMILE_CONFIG}" -I "${TEST_AUDIO}" -O "${outputFile}"`;
  
  try {
    console.log('执行命令:', command);
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('INFO')) {
      console.log('⚠️ 警告输出:', stderr);
    }
    
    // 检查输出文件
    const output = await fs.readFile(outputFile, 'utf-8');
    const lines = output.trim().split('\n');
    
    if (lines.length >= 2) {
      console.log('✅ OpenSMILE分析成功完成');
      console.log('📊 输出特征数量:', lines[0].split(',').length);
      console.log('📝 输出文件:', outputFile);
      console.log('前几个特征:', lines[0].split(',').slice(0, 5).join(', '), '...\n');
      
      // 清理测试文件
      await fs.unlink(outputFile);
      
      return true;
    } else {
      console.log('❌ OpenSMILE输出格式异常');
      return false;
    }
    
  } catch (error) {
    console.log('❌ OpenSMILE分析失败:', error.message);
    return false;
  }
}

// 辅助函数
function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// 主函数
async function main() {
  const success = await testOpenSMILE();
  
  if (success) {
    console.log('🎉 OpenSMILE集成测试全部通过！');
    console.log('现在可以在面试练习平台中使用OpenSMILE语速分析功能。\n');
    
    console.log('📋 使用说明:');
    console.log('1. 在自我介绍页面点击"开始自我介绍"');
    console.log('2. 完成自我介绍后点击"OpenSMILE语速分析"');
    console.log('3. 查看详细的语速、流畅度和语音质量分析结果');
    
  } else {
    console.log('💥 OpenSMILE集成测试失败！');
    console.log('请检查上述错误信息并解决相关问题。\n');
    
    console.log('🔧 故障排除:');
    console.log('1. 确保OpenSMILE已正确安装');
    console.log('2. 检查环境变量OPENSMILE_BINARY和OPENSMILE_CONFIG');
    console.log('3. 安装FFmpeg用于音频格式转换');
    console.log('4. 查看docs/OPENSMILE_SETUP.md获取详细安装指南');
  }
}

// 运行测试
main().catch(console.error);
