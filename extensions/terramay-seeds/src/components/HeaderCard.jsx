export default function HeaderCard({ success }) {
    return (
      <>
        <s-banner>
          <s-heading>🌱 Terramay Seeds</s-heading>
  
          <s-text>
            Earn 1 Seed for every €1 spent on products.
            Redeem your Seeds for exclusive rewards.
          </s-text>
        </s-banner>
  
        {success && (
          <s-banner>
            <s-text>{success}</s-text>
          </s-banner>
        )}
      </>
    );
  }