export default function RewardCard({
    reward,
    balance,
    redeeming,
    onRedeem,
  }) {
    return (
      <s-banner>
  
        <s-stack direction="inline" gap="base">
  
          <s-stack direction="block">
  
            <s-heading>
              {reward.name}
            </s-heading>
  
            <s-text>
              Cost: 🌱 {reward.seed_cost} Seeds
            </s-text>
  
            <s-text>
              {balance >= reward.seed_cost
                ? "🎉 Available Now!"
                : `Need ${reward.seed_cost - balance} more Seeds`}
            </s-text>
  
          </s-stack>
  
          <s-button
            disabled={
              redeeming ||
              balance < reward.seed_cost
            }
            onClick={() => onRedeem(reward)}
          >
            Redeem
          </s-button>
  
        </s-stack>
  
      </s-banner>
    );
  }