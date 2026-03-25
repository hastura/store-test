/**
 * Helper to fetch data from Shopify Storefront API
 * 
 * Instructions:
 * 1. Get your Shopify API credentials (domain and storefront access token).
 * 2. Add them to your .env file:
 *    VITE_SHOPIFY_STORENAME=your-store.myshopify.com
 *    VITE_SHOPIFY_ACCESS_TOKEN=your_token_here
 */

const storefrontToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;
const storefrontDomain = import.meta.env.VITE_SHOPIFY_STORENAME;

export async function fetchStorefront(query, variables = {}) {
  if (!storefrontToken || !storefrontDomain) {
    console.warn("Shopify Storefront API credentials not found in environment.");
    return null;
  }

  const response = await fetch(`https://${storefrontDomain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Example query to fetch products
 */
export const FETCH_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
