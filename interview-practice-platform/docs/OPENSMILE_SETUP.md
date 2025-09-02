# OpenSMILE 集成设置指南

## 概述
本项目集成了OpenSMILE进行语速和语音质量分析，提供比简单字数统计更精确的语音分析。

## 安装OpenSMILE

### Windows
1. 下载OpenSMILE: https://github.com/audeering/opensmile/releases
2. 解压到 `C:\opensmile\`
3. 添加到环境变量PATH

### Linux/macOS
```bash
# 安装依赖
sudo apt-get install build-essential cmake

# 编译OpenSMILE
git clone https://github.com/audeering/opensmile.git
cd opensmile
mkdir build && cd build
cmake -DCMAKE_INSTALL_PREFIX=/usr/local ..
make -j4
sudo make install
```

## 环境变量配置

在 `.env` 文件中添加：
```env
# OpenSMILE配置
OPENSMILE_BINARY=/usr/local/bin/SMILExtract
OPENSMILE_CONFIG=/usr/local/share/opensmile/config/emobase2010.conf
```

## 依赖安装

安装FFmpeg用于音频格式转换：
```bash
# Windows (使用Chocolatey)
choco install ffmpeg

# Linux
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

## 功能特性

- 语速分析 (音节/秒)
- 流畅度评估
- 自信度分析
- 语音质量检测
- 情感特征提取

## API使用

```javascript
const formData = new FormData()
formData.append('audioFile', audioBlob)
formData.append('username', username)

const response = await fetch('/api/audio-analysis/opensmile', {
  method: 'POST',
  body: formData
})
```
