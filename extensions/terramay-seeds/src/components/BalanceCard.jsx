export default function BalanceCard({ balance }) {
    return (
      <s-banner>
  
        <s-stack direction="block" gap="base">
  
          <s-text>
            Available Seeds
          </s-text>
  
          <s-heading>
            🌱 {balance} Seeds
          </s-heading>
  
          <s-text>
            Earn 1 Seed for every €1 spent on products.
          </s-text>
  
        </s-stack>
  
      </s-banner>
    );
  }