const API_BASE_URL = "https://p01--recharge-add-extras--yj8tfgj8dpk9.code.run";

/**
 * Create customer if it doesn't already exist
 */
export async function createCustomer(shopifyCustomerId, email) {
  const response = await fetch(
    `${API_BASE_URL}/seeds/customer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        shopify_customer_id: shopifyCustomerId,
        email,
      }),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

/**
 * Load customer dashboard
 */
export async function getDashboard(shopifyCustomerId) {
  const response = await fetch(
    `${API_BASE_URL}/seeds/dashboard/${shopifyCustomerId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

/**
 * Redeem reward
 */
export async function redeemReward(
  shopifyCustomerId,
  rewardId
) {
  const response = await fetch(
    `${API_BASE_URL}/seeds/redeem`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        shopify_customer_id: shopifyCustomerId,
        reward_id: rewardId,
      }),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}