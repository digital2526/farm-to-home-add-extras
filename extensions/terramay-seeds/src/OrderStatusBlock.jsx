import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

import {
  createCustomer,
  getDashboard,
  redeemReward,
} from "./api";


function buildProgressBar(percent) {
  const total = 10;
  const filled = Math.round((percent / 100) * total);

  return "🟢".repeat(filled) + "⚪".repeat(total - filled);
}

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  const [customerId, setCustomerId] = useState(null);

  async function loadDashboard(id) {
    try {
      const data = await getDashboard(id);

      console.log("Dashboard:", data);

      setDashboard(data);
      setError("");
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);

        // Fetch logged-in Shopify customer
        const response = await fetch(
          "shopify://customer-account/api/2026-04/graphql.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query {
                  customer {
                    id
                    emailAddress {
                      emailAddress
                    }
                  }
                }
              `,
            }),
          }
        );

        const json = await response.json();


        const gid = json.data.customer.id;

        const id = gid.split("/").pop();

        const email =
          json.data.customer.emailAddress.emailAddress;


        setCustomerId(id);

        // Create customer if needed
        await createCustomer(id, email);

        // Load dashboard
        const dashboard = await getDashboard(id);

        setDashboard(dashboard);

        setError("");
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function confirmRedeem() {
    if (!selectedReward) return;
    try {
      setRedeeming(true);
      await redeemReward(
        customerId,
        selectedReward.id
      );
      await loadDashboard(customerId);
      setSuccess(
        `🎉 ${selectedReward.name} redeemed successfully!`
      );
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setSelectedReward(null);
  
    } catch (err) {
  
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Redeem failed");
      }
  
    } finally {
  
      setRedeeming(false);
  
    }
  
  }

  const nextReward = dashboard?.rewards
  ?.filter((reward) => reward.seed_cost > dashboard.balance)
  ?.sort((a, b) => a.seed_cost - b.seed_cost)[0];

  const seedsRemaining = nextReward
    ? nextReward.seed_cost - dashboard.balance
    : 0;

  const progress = nextReward
    ? Math.min(
        100,
        Math.round(
          (dashboard.balance / nextReward.seed_cost) * 100
        )
      )
    : 100;

  if (loading) {
    return (
      <s-section>
        <s-banner>
          <s-text>Loading Terramay Seeds...</s-text>
        </s-banner>
      </s-section>
    );
  }

  if (error) {
    return (
      <s-section>
        <s-banner tone="critical">
          <s-text>{error}</s-text>
        </s-banner>
      </s-section>
    );
  }

  return (
    <s-section>

      <s-stack direction="block" gap="base">

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

        <s-banner>

        <s-stack direction="block" gap="base">

          <s-text>
            Available Seeds
          </s-text>

          <s-heading>
            🌱 {dashboard.balance} Seeds
          </s-heading>

          <s-text>
            Earn 1 Seed for every €1 spent on products.
          </s-text>

        </s-stack>

      </s-banner>

      {nextReward && (

        <s-banner>

          <s-heading>
            🎯 Next Reward
          </s-heading>

          <s-text>
            {nextReward.name}
          </s-text>

          <s-text>
            You're only 🌱 {seedsRemaining} Seeds away.
          </s-text>

          <s-text>
            Progress: {progress}%
          </s-text>

          <s-text>
            {buildProgressBar(progress)}
          </s-text>

        </s-banner>

        )}

        {selectedReward && (

        <s-banner>

          <s-heading>
            Redeem Reward
          </s-heading>

          <s-text>
            Redeem "{selectedReward.name}"?
          </s-text>

          <s-text>
            This will cost 🌱 {selectedReward.seed_cost} Seeds.
          </s-text>

          <s-stack direction="inline" gap="base">

            <s-button
              onClick={() => setSelectedReward(null)}
            >
              Cancel
            </s-button>

            <s-button
              onClick={confirmRedeem}
              disabled={redeeming}
            >
              {redeeming ? "Redeeming..." : "Confirm"}
            </s-button>

          </s-stack>

        </s-banner>

        )}
        <s-heading>
          🎁 Available Rewards
        </s-heading>

        {dashboard.rewards.map((reward) => (

          <s-banner key={reward.id}>

            <s-stack
              direction="inline"
              gap="base"
            >

              <s-stack direction="block">

              <s-heading>
                {reward.name}
              </s-heading>

              <s-text>
                Cost: 🌱 {reward.seed_cost} Seeds
              </s-text>

              <s-text>
                {dashboard.balance >= reward.seed_cost
                  ? "🎉 Available Now!"
                  : `Need ${reward.seed_cost - dashboard.balance} more Seeds`}
              </s-text>

              </s-stack>

              <s-button
                disabled={
                  redeeming ||
                  dashboard.balance < reward.seed_cost
                }
                onClick={() => setSelectedReward(reward)}
              >
                Redeem
              </s-button>

            </s-stack>

          </s-banner>

        ))}

        <s-heading>
          📜 Recent Activity
        </s-heading>

        {dashboard.history.length === 0 ? (
          <s-banner>

            <s-heading>
              🌱 Start earning Seeds!
            </s-heading>
          
            <s-heading>
              🌱 No activity yet
            </s-heading>

            <s-text>
              Every purchase earns Seeds.
              Your rewards history will appear here.
            </s-text>
          
          </s-banner>
        ) : (
          dashboard.history.map((item) => (

            <s-banner key={item.id}>
          
              <s-stack
                direction="inline"
              >
          
              <s-heading>
                  {item.amount > 0
                    ? `🟢 +${item.amount} Seeds`
                    : `🔴 ${item.amount} Seeds`}
              </s-heading>
          
                <s-text>
          
                  {item.reason}
          
                </s-text>
          
              </s-stack>
          
            </s-banner>
          
          ))
        )}

      </s-stack>

    </s-section>
  );
}
