/**
 * Helper to fetch data from Shopify/Mock.shop API
 */

const storefrontToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;
const storefrontDomain = import.meta.env.VITE_SHOPIFY_STORENAME;

/**
 * Universal Fetcher
 * Optimized for mock.shop if no credentials are provided
 */
export async function fetchStorefront(query, variables = {}) {
  // Use mock.shop by default if no credentials
  const isMock = !storefrontToken || storefrontDomain === 'mock.shop';
  const endpoint = isMock 
    ? "https://mock.shop/api" 
    : `https://${storefrontDomain}/api/2024-01/graphql.json`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (!isMock) {
    headers["X-Shopify-Storefront-Access-Token"] = storefrontToken;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetch products with variant IDs
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
                id
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

/**
 * Checkout Mutation (Note: mock.shop doesn't support redirects to checkout, 
 * but our real shopify integration here will)
 */
export const CHECKOUT_CREATE_MUTATION = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;
