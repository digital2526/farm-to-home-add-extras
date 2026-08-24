function buildProgressBar(percent) {
    const total = 10;
    const filled = Math.round((percent / 100) * total);
  
    return "🟢".repeat(filled) + "⚪".repeat(total - filled);
  }
  
  export default function NextRewardCard({
    reward,
    remaining,
    progress,
  }) {
    if (!reward) return null;
  
    return (
      <s-banner>
  
        <s-heading>
          🎯 Next Reward
        </s-heading>
  
        <s-text>
          {reward.name}
        </s-text>
  
        <s-text>
          You're only 🌱 {remaining} Seeds away.
        </s-text>
  
        <s-text>
          Progress: {progress}%
        </s-text>
  
        <s-text>
          {buildProgressBar(progress)}
        </s-text>
  
      </s-banner>
    );
  }