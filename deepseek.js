const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 设置 CORS 头部
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: '方法不被允许' }),
    };
  }

  try {
    const { opponentText, intensity } = JSON.parse(event.body);

    if (!opponentText || !intensity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '缺少必要参数' }),
      };
    }

    // 根据语气强度调整 prompt
    const intensityLevels = [
      '温和理性地',
      '稍微严肃地',
      '直接地',
      '严厉地',
      '犀利地',
      '强烈地',
      '激烈地',
      '狠狠地',
      '毫不留情地',
      '一针见血地'
    ];

    const intensityDescription = intensityLevels[Math.min(intensity - 1, 9)];

    const prompt = `你是一个擅长辩论和回怼的助手。现在有人对我说："${opponentText}"，请你帮我${intensityDescription}回应3句话。

要求：
1. 每句话都要有力且逻辑清晰
2. 根据语气强度（${intensity}/10）调整回应的激烈程度
3. 回应要聪明、机智，但不要过于粗俗
4. 每句话不超过50字
5. 用简体中文回答
6. 只返回3句回应，每句话用换行分隔，不要其他解释

回应：`;

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个擅长辩论和回怼的助手。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API 错误:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `API 请求失败: ${response.status} ${response.statusText}` }),
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // 解析回应，分割成3句话
    const responses = content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        responses,
        timestamp: Date.now(),
      }),
    };

  } catch (error) {
    console.error('生成回应时发生错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '无法生成回应，请稍后再试' }),
    };
  }
}; 