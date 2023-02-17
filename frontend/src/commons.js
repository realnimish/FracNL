import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import BN from "bn.js";

export async function getAllAccounts() {
  const extensions = await web3Enable("Gencom");
  if (extensions.length === 0) {
    return [];
  }
  const allAccounts = await web3Accounts();
  return allAccounts;
}

export function cutAddress(addr, front = 5, back = 4) {
  if (!addr) return "";
  return addr.substring(0, front) + "..." + addr.substring(addr.length - back);
}

export async function makeTransaction(
  api,
  contracts,
  callerAddress,
  contract,
  funcName,
  signer,
  value = 0,
  parameters = [],
  onFinalised = () => {
    console.log("Finalized");
  },
  callAfterTransactionSubmited = () => {
    console.log("Transaction Submitted");
  }
) {
  if (contracts && contracts[contract] && callerAddress) {
    try {
      const gasLimit = api.registry.createType("WeightV2", {
        refTime: new BN("100000000000"),
        proofSize: new BN("100000000000"),
      });
      console.log(contract, funcName);
      await contracts[contract].query[funcName](
        callerAddress.address,
        {
          value,
          gasLimit,
        },
        ...parameters
      )
        .then((res) => {
          console.log(
            "In transaction",
            res,
            res?.result?.toHuman(),
            res?.output?.toHuman()
          );
          if (res.output?.toHuman()?.Ok?.Err) {
            throw res.output?.toHuman()?.Ok?.Err;
          } else if (res.output?.toHuman()?.Err) {
            throw res.output?.toHuman()?.Err;
          } else if (res.result?.toHuman()?.Err?.Module?.error) {
            throw new Error(
              res.result.toHuman().Err.Module.error === "0x04000000"
                ? "TransferFailed"
                : res.result.toHuman().Err.Module.error
            );
          } else return res.output.toHuman();
        })
        .then(async (res) => {
          if (!res.Err) {
            await contracts[contract].tx[funcName](
              {
                value,
                gasLimit,
              },
              ...parameters
            ).signAndSend(callerAddress.address, { signer }, async (res) => {
              if (res.status.isFinalized) {
                onFinalised(res);
              }
            });
            callAfterTransactionSubmited();
          } else {
            console.log(res.Err);
            throw res.Err;
          }
        })
        .catch((err) => {
          console.log("Caught error", err);
          throw err;
        });
    } catch (err) {
      console.log("Error caught", err);
      throw err;
    }
  } else {
    throw "Something is wrong with contracts or  contract or callerAddress";
  }
}

export async function makeQuery(
  api,
  contracts,
  callerAddress,
  contract,
  funcName,
  value = 0,
  parameters = [],
  outputIsOK = (res) => {
    console.log("Output: ", res);
  },
  errorHandler = (res) => {
    console.log("Error: ", res);
  }
) {
  if (contracts && contracts[contract] && callerAddress) {
    try {
      const gasLimit = api.registry.createType("WeightV2", {
        refTime: new BN("100000000000"),
        proofSize: new BN("100000000000"),
      });
      await contracts[contract].query[funcName](
        callerAddress.address,
        {
          value,
          gasLimit,
        },
        ...parameters
      ).then((res) => {
        if (!res.output?.toHuman()?.Err) {
          outputIsOK(res.output?.toHuman());
        } else {
          errorHandler(res);
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  } else {
    console.log(
      "Something is wrong with contracts or  contract or callerAddress"
    );
  }
}

export const NETWORK_ENDPOINT = "wss://aleph-zero-testnet-rpc.dwellir.com";
export const ERC721_ADDRESS =
  "5CP32T4iEE2RdneJpy2oDMRKtQyQBJ1udzM6aJjaENpgPpWQ";
export const FRACTIONALIZER_ADDRESS =
  "5H7ykdx3ssNEMXKw6K9th4jiTQ8kWYiCJjV24SJGYpxd378f";
export const NFT_LENDING_ADDRESS =
  "5Cj5FxECJAN3YZJ4rAecwREiz4mXwt7ZKBVLaNgVLQQznqZf";

export const ABI_ERC721 = {
  source: {
    hash: "0x0d7a94e2cdfaaa5d54d16fa0ef597b09c1288ee597b833c278dcc53a0ff3ce2b",
    language: "ink! 4.0.0-rc",
    compiler: "rustc 1.67.0",
    build_info: {
      build_mode: "Debug",
      cargo_contract_version: "2.0.0-rc.1",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z",
      },
    },
  },
  contract: {
    name: "erc721",
    version: "4.0.0-rc",
    authors: ["Parity Technologies <admin@parity.io>"],
  },
  spec: {
    constructors: [
      {
        args: [],
        docs: ["Creates a new ERC-721 token contract."],
        label: "new",
        payable: false,
        returnType: {
          displayName: ["ink_primitives", "ConstructorResult"],
          type: 6,
        },
        selector: "0x9bae9d5e",
      },
    ],
    docs: [],
    events: [
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "from",
            type: {
              displayName: ["Option"],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "to",
            type: {
              displayName: ["Option"],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Event emitted when a token transfer occurs."],
        label: "Transfer",
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "from",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Event emitted when a token approve occurs."],
        label: "Approval",
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            docs: [],
            indexed: false,
            label: "approved",
            type: {
              displayName: ["bool"],
              type: 16,
            },
          },
        ],
        docs: [
          " Event emitted when an operator is enabled or disabled for an owner.",
          " The operator can manage all NFTs of the owner.",
        ],
        label: "ApprovalForAll",
      },
    ],
    lang_error: {
      displayName: ["ink", "LangError"],
      type: 7,
    },
    messages: [
      {
        args: [
          {
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
        ],
        docs: [
          " Returns the balance of the owner.",
          "",
          " This represents the amount of unique tokens the owner has.",
        ],
        label: "balance_of",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0x0f755a56",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Returns the owner of the token."],
        label: "owner_of",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0x99720c1e",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Returns the approved account ID for this token if any."],
        label: "get_approved",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0x27592dea",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Returns the uri path associated with the token"],
        label: "get_token_uri",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 11,
        },
        selector: "0x951a9bfa",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
        ],
        docs: [],
        label: "get_user_tokens",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 13,
        },
        selector: "0x1855c9a8",
      },
      {
        args: [
          {
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
        ],
        docs: [" Returns `true` if the operator is approved by the owner."],
        label: "is_approved_for_all",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x0f5922e9",
      },
      {
        args: [
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "approved",
            type: {
              displayName: ["bool"],
              type: 16,
            },
          },
        ],
        docs: [
          " Approves or disapproves the operator for all tokens of the caller.",
        ],
        label: "set_approval_for_all",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 17,
        },
        selector: "0xcfd0c27b",
      },
      {
        args: [
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [
          " Approves the account to transfer the specified token on behalf of the caller.",
        ],
        label: "approve",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 17,
        },
        selector: "0x681266a0",
      },
      {
        args: [
          {
            label: "destination",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [
          " Transfers the token from the caller to the given destination.",
        ],
        label: "transfer",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 17,
        },
        selector: "0x84a15da1",
      },
      {
        args: [
          {
            label: "from",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 1,
            },
          },
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [" Transfer approved or owned token."],
        label: "transfer_from",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 17,
        },
        selector: "0x0b396f18",
      },
      {
        args: [
          {
            label: "uri",
            type: {
              displayName: ["String"],
              type: 4,
            },
          },
        ],
        docs: [" Creates a new token."],
        label: "mint",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 20,
        },
        selector: "0xcfdd9aa2",
      },
      {
        args: [
          {
            label: "id",
            type: {
              displayName: ["TokenId"],
              type: 0,
            },
          },
        ],
        docs: [
          " Deletes an existing token. Only the owner can burn the token.",
        ],
        label: "burn",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 17,
        },
        selector: "0xb1efc17b",
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "token_nonce",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xed16db9e",
                      ty: 1,
                    },
                  },
                  root_key: "0xed16db9e",
                },
              },
              name: "token_owner",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x1f2f81e1",
                      ty: 4,
                    },
                  },
                  root_key: "0x1f2f81e1",
                },
              },
              name: "token_uri",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x4d897660",
                      ty: 1,
                    },
                  },
                  root_key: "0x4d897660",
                },
              },
              name: "token_approvals",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xb5379df2",
                      ty: 0,
                    },
                  },
                  root_key: "0xb5379df2",
                },
              },
              name: "owned_tokens_count",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xad984333",
                      ty: 5,
                    },
                  },
                  root_key: "0xad984333",
                },
              },
              name: "operator_approvals",
            },
          ],
          name: "Erc721",
        },
      },
      root_key: "0x00000000",
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          primitive: "u32",
        },
      },
    },
    {
      id: 1,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 2,
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "AccountId"],
      },
    },
    {
      id: 2,
      type: {
        def: {
          array: {
            len: 32,
            type: 3,
          },
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          primitive: "u8",
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          primitive: "str",
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 5,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 7,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 1,
                name: "CouldNotReadInput",
              },
            ],
          },
        },
        path: ["ink_primitives", "LangError"],
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 0,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 10,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 10,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 1,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 1,
          },
        ],
        path: ["Option"],
      },
    },
    {
      id: 11,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 12,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 12,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 12,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 4,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 4,
          },
        ],
        path: ["Option"],
      },
    },
    {
      id: 13,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 14,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 14,
      type: {
        def: {
          sequence: {
            type: 0,
          },
        },
      },
    },
    {
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 16,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 16,
      type: {
        def: {
          primitive: "bool",
        },
      },
    },
    {
      id: 17,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 18,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 18,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 18,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 19,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 5,
          },
          {
            name: "E",
            type: 19,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 19,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "NotOwner",
              },
              {
                index: 1,
                name: "NotApproved",
              },
              {
                index: 2,
                name: "TokenExists",
              },
              {
                index: 3,
                name: "TokenNotFound",
              },
              {
                index: 4,
                name: "CannotInsert",
              },
              {
                index: 5,
                name: "CannotFetchValue",
              },
              {
                index: 6,
                name: "NotAllowed",
              },
            ],
          },
        },
        path: ["erc721", "erc721", "Error"],
      },
    },
    {
      id: 20,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 21,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 21,
          },
          {
            name: "E",
            type: 7,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 21,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 19,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 0,
          },
          {
            name: "E",
            type: 19,
          },
        ],
        path: ["Result"],
      },
    },
  ],
  version: "4",
};
export const ABI_FRACTIONALIZER = {
  source: {
    hash: "0x80eb22742429a6904aec81c221c4260f0024b3605176538ba12c8441e9880a76",
    language: "ink! 4.0.0-rc",
    compiler: "rustc 1.67.0",
    build_info: {
      build_mode: "Debug",
      cargo_contract_version: "2.0.0-rc.1",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z",
      },
    },
  },
  contract: {
    name: "fractionalizer",
    version: "4.0.0-rc",
    authors: ["Parity Technologies <admin@parity.io>"],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: "nft_contract",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [
          "Initialize a default instance of this ERC-1155 implementation.",
        ],
        label: "new",
        payable: false,
        returnType: {
          displayName: ["ink_primitives", "ConstructorResult"],
          type: 7,
        },
        selector: "0x9bae9d5e",
      },
    ],
    docs: [],
    events: [
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "minter",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            docs: [],
            indexed: false,
            label: "shares",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
        ],
        docs: [" Indicate that a NFT has been fractionalized"],
        label: "Fractionalized",
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "caller",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "withdraw_address",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [" Indicate that a NFT has been de-fractionalized"],
        label: "Defractionalized",
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "operator",
            type: {
              displayName: ["Option"],
              type: 25,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "from",
            type: {
              displayName: ["Option"],
              type: 25,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "to",
            type: {
              displayName: ["Option"],
              type: 25,
            },
          },
          {
            docs: [],
            indexed: false,
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            docs: [],
            indexed: false,
            label: "value",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
        ],
        docs: [
          " Indicate that a token transfer has occured.",
          "",
          " This must be emitted even if a zero value transfer occurs.",
        ],
        label: "TransferSingle",
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            docs: [],
            indexed: false,
            label: "approved",
            type: {
              displayName: ["bool"],
              type: 13,
            },
          },
        ],
        docs: [" Indicate that an approval event has happened."],
        label: "ApprovalForAll",
      },
      {
        args: [
          {
            docs: [],
            indexed: false,
            label: "value",
            type: {
              displayName: ["ink", "prelude", "string", "String"],
              type: 26,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
        ],
        docs: [" Indicate that a token's URI has been updated."],
        label: "Uri",
      },
    ],
    lang_error: {
      displayName: ["ink", "LangError"],
      type: 8,
    },
    messages: [
      {
        args: [
          {
            label: "nft_id",
            type: {
              displayName: ["u32"],
              type: 6,
            },
          },
          {
            label: "shares",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "fractionlize",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0xbb1aafac",
      },
      {
        args: [
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "defractionlize",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0xf07629e7",
      },
      {
        args: [
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
        ],
        docs: [],
        label: "is_fractionalized",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x3593f43d",
      },
      {
        args: [
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
        ],
        docs: [],
        label: "token_supply",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 14,
        },
        selector: "0x742cb68b",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_user_holdings",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 16,
        },
        selector: "0x2d0e7cbf",
      },
      {
        args: [
          {
            label: "from",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            label: "value",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "data",
            type: {
              displayName: ["Vec"],
              type: 19,
            },
          },
        ],
        docs: [],
        label: "Erc1155::safe_transfer_from",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0x5324d556",
      },
      {
        args: [
          {
            label: "from",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "token_ids",
            type: {
              displayName: ["Vec"],
              type: 5,
            },
          },
          {
            label: "values",
            type: {
              displayName: ["Vec"],
              type: 20,
            },
          },
          {
            label: "data",
            type: {
              displayName: ["Vec"],
              type: 19,
            },
          },
        ],
        docs: [],
        label: "Erc1155::safe_batch_transfer_from",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0xf7f5fd62",
      },
      {
        args: [
          {
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
        ],
        docs: [],
        label: "Erc1155::balance_of",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 21,
        },
        selector: "0x164b9ba0",
      },
      {
        args: [
          {
            label: "owners",
            type: {
              displayName: ["Vec"],
              type: 22,
            },
          },
          {
            label: "token_ids",
            type: {
              displayName: ["Vec"],
              type: 5,
            },
          },
        ],
        docs: [],
        label: "Erc1155::balance_of_batch",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 23,
        },
        selector: "0x221b4f73",
      },
      {
        args: [
          {
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "approved",
            type: {
              displayName: ["bool"],
              type: 13,
            },
          },
        ],
        docs: [],
        label: "Erc1155::set_approval_for_all",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 9,
        },
        selector: "0x332ba788",
      },
      {
        args: [
          {
            label: "owner",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "Erc1155::is_approved_for_all",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x36034d3e",
      },
      {
        args: [
          {
            label: "_operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_from",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            label: "_value",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "_data",
            type: {
              displayName: ["Vec"],
              type: 19,
            },
          },
        ],
        docs: [],
        label: "Erc1155TokenReceiver::on_received",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 24,
        },
        selector: "0xf23a6e61",
      },
      {
        args: [
          {
            label: "_operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_from",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_token_ids",
            type: {
              displayName: ["Vec"],
              type: 5,
            },
          },
          {
            label: "_values",
            type: {
              displayName: ["Vec"],
              type: 20,
            },
          },
          {
            label: "_data",
            type: {
              displayName: ["Vec"],
              type: 19,
            },
          },
        ],
        docs: [],
        label: "Erc1155TokenReceiver::on_batch_received",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 24,
        },
        selector: "0xbc197c81",
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "nft_contract",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xf820ff02",
                      ty: 3,
                    },
                  },
                  root_key: "0xf820ff02",
                },
              },
              name: "balances",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x336693a1",
                      ty: 4,
                    },
                  },
                  root_key: "0x336693a1",
                },
              },
              name: "approvals",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x4b44b4de",
                      ty: 3,
                    },
                  },
                  root_key: "0x4b44b4de",
                },
              },
              name: "token_supply",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x2a2dc547",
                      ty: 5,
                    },
                  },
                  root_key: "0x2a2dc547",
                },
              },
              name: "user_holdings",
            },
          ],
          name: "Contract",
        },
      },
      root_key: "0x00000000",
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 1,
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "AccountId"],
      },
    },
    {
      id: 1,
      type: {
        def: {
          array: {
            len: 32,
            type: 2,
          },
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          primitive: "u8",
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          primitive: "u128",
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          sequence: {
            type: 6,
          },
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          primitive: "u32",
        },
      },
    },
    {
      id: 7,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 4,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 4,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 1,
                name: "CouldNotReadInput",
              },
            ],
          },
        },
        path: ["ink_primitives", "LangError"],
      },
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 10,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 10,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 4,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 11,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 4,
          },
          {
            name: "E",
            type: 11,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 11,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "AlreadyFractionalized",
              },
              {
                index: 1,
                name: "UnexistentToken",
              },
              {
                index: 2,
                name: "ZeroShares",
              },
              {
                index: 3,
                name: "ZeroAddressTransfer",
              },
              {
                index: 4,
                name: "NotApproved",
              },
              {
                index: 5,
                name: "InsufficientBalance",
              },
              {
                index: 6,
                name: "SelfApproval",
              },
              {
                index: 7,
                name: "BatchTransferMismatch",
              },
              {
                index: 8,
                name: "NftTransferFailed",
              },
            ],
          },
        },
        path: ["fractionalizer", "Error"],
      },
    },
    {
      id: 12,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 13,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 13,
      type: {
        def: {
          primitive: "bool",
        },
      },
    },
    {
      id: 14,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 15,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 15,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 3,
          },
        ],
        path: ["Option"],
      },
    },
    {
      id: 16,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 17,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 17,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 17,
      type: {
        def: {
          sequence: {
            type: 18,
          },
        },
      },
    },
    {
      id: 18,
      type: {
        def: {
          tuple: [6, 3, 3],
        },
      },
    },
    {
      id: 19,
      type: {
        def: {
          sequence: {
            type: 2,
          },
        },
      },
    },
    {
      id: 20,
      type: {
        def: {
          sequence: {
            type: 3,
          },
        },
      },
    },
    {
      id: 21,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 3,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 22,
      type: {
        def: {
          sequence: {
            type: 0,
          },
        },
      },
    },
    {
      id: 23,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 20,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 20,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 24,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 19,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 19,
          },
          {
            name: "E",
            type: 8,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 25,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 0,
          },
        ],
        path: ["Option"],
      },
    },
    {
      id: 26,
      type: {
        def: {
          primitive: "str",
        },
      },
    },
  ],
  version: "4",
};
export const ABI_NFT_LENDING = {
  source: {
    hash: "0xcafea4a05b57694c896eea42d5365b7c77bad1c8a55b36561f929ac45020aca2",
    language: "ink! 4.0.0",
    compiler: "rustc 1.67.0",
    build_info: {
      build_mode: "Debug",
      cargo_contract_version: "2.0.0-rc.1",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z",
      },
    },
  },
  contract: {
    name: "nft_lending",
    version: "0.1.0",
    authors: ["Nimish Agrawal realnimish@gmail.com"],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: "fractionalizer",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "offer_phase_duration",
            type: {
              displayName: ["Time"],
              type: 4,
            },
          },
          {
            label: "cooldown_phase_duration",
            type: {
              displayName: ["Time"],
              type: 4,
            },
          },
        ],
        docs: [
          "Constructor that initializes the `bool` value to the given `init_value`.",
        ],
        label: "new",
        payable: false,
        returnType: {
          displayName: ["ink_primitives", "ConstructorResult"],
          type: 7,
        },
        selector: "0x9bae9d5e",
      },
    ],
    docs: [],
    events: [
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: "borrower",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "NewLoanAd",
      },
    ],
    lang_error: {
      displayName: ["ink", "LangError"],
      type: 9,
    },
    messages: [
      {
        args: [
          {
            label: "operator",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_from",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "_token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            label: "_value",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "_data",
            type: {
              displayName: ["Vec"],
              type: 10,
            },
          },
        ],
        docs: [
          " This contract supportz receiving single ERC1155 token transfer",
        ],
        label: "signal_erc1155_support",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 11,
        },
        selector: "0xf23a6e61",
      },
      {
        args: [
          {
            label: "token_id",
            type: {
              displayName: ["TokenId"],
              type: 6,
            },
          },
          {
            label: "shares_to_lock",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "amount_asked",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "loan_period",
            type: {
              displayName: ["Time"],
              type: 4,
            },
          },
        ],
        docs: [],
        label: "list_advertisement",
        mutates: true,
        payable: true,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0xd0c8891b",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "start_loan",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x76f456a1",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "cancel_loan",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x54e08595",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "repay_loan",
        mutates: true,
        payable: true,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x2a01c432",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "claim_loan_default",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0xa21450c7",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "interest",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "make_offer",
        mutates: true,
        payable: true,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x719d1078",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "withdraw_offer",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x42ff4396",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "offer_id",
            type: {
              displayName: ["OfferId"],
              type: 3,
            },
          },
          {
            label: "response",
            type: {
              displayName: ["bool"],
              type: 17,
            },
          },
        ],
        docs: [],
        label: "respond_to_offer",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0xba1f730a",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_offer_nonce",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 18,
        },
        selector: "0x7a03a940",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "borrow_amount",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
          {
            label: "loan_period",
            type: {
              displayName: ["Time"],
              type: 4,
            },
          },
        ],
        docs: [],
        label: "get_collateral_required",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 18,
        },
        selector: "0x4ff20fac",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "is_offer_phase",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0xd431ef71",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "is_cooldown_phase",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0xe8a63708",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_max_lend_amt",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x68aab9ec",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_user_loans",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 19,
        },
        selector: "0x62af3bd0",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_loan_offers",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 19,
        },
        selector: "0xe200dc24",
      },
      {
        args: [],
        docs: [],
        label: "get_all_loans",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 21,
        },
        selector: "0xa8b86953",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_all_offers",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 28,
        },
        selector: "0xd2ce41dc",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_user_offers",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 33,
        },
        selector: "0xd6692f17",
      },
      {
        args: [],
        docs: [],
        label: "get_loan_nonce",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 18,
        },
        selector: "0x6b700eb5",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_loan_metadata",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 36,
        },
        selector: "0x07b38e35",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_loan_stats",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 38,
        },
        selector: "0xbbd48be2",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_loan_details",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 40,
        },
        selector: "0x3bf654f3",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "offer_id",
            type: {
              displayName: ["OfferId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_offer_details",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 43,
        },
        selector: "0x6468f5a3",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_active_offer_id",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0x0d2ac432",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "reject_all_pending_offers",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x8707a7c6",
      },
      {
        args: [],
        docs: [],
        label: "get_cancellation_charges",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 18,
        },
        selector: "0xcbadb4fd",
      },
      {
        args: [
          {
            label: "to",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
          {
            label: "amount",
            type: {
              displayName: ["Balance"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "drain_funds",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 15,
        },
        selector: "0x9122cf2e",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_borrowers_settlement",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 12,
        },
        selector: "0xeba746c6",
      },
      {
        args: [
          {
            label: "loan_id",
            type: {
              displayName: ["LoanId"],
              type: 3,
            },
          },
          {
            label: "offer_id",
            type: {
              displayName: ["OfferId"],
              type: 3,
            },
          },
        ],
        docs: [],
        label: "get_lenders_settlement",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 45,
        },
        selector: "0xba3c5573",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [],
        label: "get_credit_score",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 47,
        },
        selector: "0x8a24ad50",
      },
      {
        args: [
          {
            label: "account",
            type: {
              displayName: ["AccountId"],
              type: 0,
            },
          },
        ],
        docs: [" [total_raised, total_lended, total_interest]"],
        label: "get_user_stats",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 48,
        },
        selector: "0x6aeaef9a",
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "admin",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "fractionalizer",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 3,
                },
              },
              name: "loan_nonce",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 4,
                },
              },
              name: "offer_phase_duration",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 4,
                },
              },
              name: "cooldown_phase_duration",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xe17854d3",
                      ty: 5,
                    },
                  },
                  root_key: "0xe17854d3",
                },
              },
              name: "credit_score",
            },
            {
              layout: {
                root: {
                  layout: {
                    struct: {
                      fields: [
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 0,
                            },
                          },
                          name: "borrower",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 6,
                            },
                          },
                          name: "token_id",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 3,
                            },
                          },
                          name: "shares_locked",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 3,
                            },
                          },
                          name: "amount_asked",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 3,
                            },
                          },
                          name: "security_deposit",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 4,
                            },
                          },
                          name: "loan_period",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0xcfd3bb52",
                              ty: 4,
                            },
                          },
                          name: "listing_timestamp",
                        },
                      ],
                      name: "LoanMetadata",
                    },
                  },
                  root_key: "0xcfd3bb52",
                },
              },
              name: "loans",
            },
            {
              layout: {
                root: {
                  layout: {
                    struct: {
                      fields: [
                        {
                          layout: {
                            enum: {
                              dispatchKey: "0x9cc36896",
                              name: "Option",
                              variants: {
                                0: {
                                  fields: [],
                                  name: "None",
                                },
                                1: {
                                  fields: [
                                    {
                                      layout: {
                                        leaf: {
                                          key: "0x9cc36896",
                                          ty: 4,
                                        },
                                      },
                                      name: "0",
                                    },
                                  ],
                                  name: "Some",
                                },
                              },
                            },
                          },
                          name: "start_timestamp",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x9cc36896",
                              ty: 3,
                            },
                          },
                          name: "raised",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x9cc36896",
                              ty: 3,
                            },
                          },
                          name: "limit_left",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x9cc36896",
                              ty: 3,
                            },
                          },
                          name: "interest",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x9cc36896",
                              ty: 3,
                            },
                          },
                          name: "repaid",
                        },
                        {
                          layout: {
                            enum: {
                              dispatchKey: "0x9cc36896",
                              name: "LoanStatus",
                              variants: {
                                0: {
                                  fields: [],
                                  name: "OPEN",
                                },
                                1: {
                                  fields: [],
                                  name: "ACTIVE",
                                },
                                2: {
                                  fields: [],
                                  name: "CLOSED",
                                },
                                3: {
                                  fields: [],
                                  name: "CANCELLED",
                                },
                              },
                            },
                          },
                          name: "loan_status",
                        },
                      ],
                      name: "LoanStats",
                    },
                  },
                  root_key: "0x9cc36896",
                },
              },
              name: "loan_stats",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xaa908de9",
                      ty: 3,
                    },
                  },
                  root_key: "0xaa908de9",
                },
              },
              name: "offers_nonce",
            },
            {
              layout: {
                root: {
                  layout: {
                    struct: {
                      fields: [
                        {
                          layout: {
                            leaf: {
                              key: "0x759d9cff",
                              ty: 0,
                            },
                          },
                          name: "lender",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x759d9cff",
                              ty: 3,
                            },
                          },
                          name: "amount",
                        },
                        {
                          layout: {
                            leaf: {
                              key: "0x759d9cff",
                              ty: 3,
                            },
                          },
                          name: "interest",
                        },
                        {
                          layout: {
                            enum: {
                              dispatchKey: "0x759d9cff",
                              name: "OfferStatus",
                              variants: {
                                0: {
                                  fields: [],
                                  name: "PENDING",
                                },
                                1: {
                                  fields: [],
                                  name: "ACCEPTED",
                                },
                                2: {
                                  fields: [],
                                  name: "REJECTED",
                                },
                                3: {
                                  fields: [],
                                  name: "WITHDRAWN",
                                },
                              },
                            },
                          },
                          name: "status",
                        },
                      ],
                      name: "OfferMetadata",
                    },
                  },
                  root_key: "0x759d9cff",
                },
              },
              name: "offers",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x58660ca4",
                      ty: 3,
                    },
                  },
                  root_key: "0x58660ca4",
                },
              },
              name: "active_offer_id",
            },
          ],
          name: "Contract",
        },
      },
      root_key: "0x00000000",
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 1,
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "AccountId"],
      },
    },
    {
      id: 1,
      type: {
        def: {
          array: {
            len: 32,
            type: 2,
          },
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          primitive: "u8",
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          primitive: "u128",
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          primitive: "u64",
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          primitive: "u16",
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          primitive: "u32",
        },
      },
    },
    {
      id: 7,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 8,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 8,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 1,
                name: "CouldNotReadInput",
              },
            ],
          },
        },
        path: ["ink_primitives", "LangError"],
      },
    },
    {
      id: 10,
      type: {
        def: {
          sequence: {
            type: 2,
          },
        },
      },
    },
    {
      id: 11,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 10,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 12,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 13,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 13,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 3,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 14,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "InsufficientSecurityDeposit",
              },
              {
                index: 1,
                name: "FractionalNftTransferFailed",
              },
              {
                index: 2,
                name: "ActiveOfferAlreadyExists",
              },
              {
                index: 3,
                name: "ExcessiveLendingAmountSent",
              },
              {
                index: 4,
                name: "NotOfferPhase",
              },
              {
                index: 5,
                name: "NotCooldownPhase",
              },
              {
                index: 6,
                name: "NoOfferExists",
              },
              {
                index: 7,
                name: "WithdrawFailed",
              },
              {
                index: 8,
                name: "InvalidLoanId",
              },
              {
                index: 9,
                name: "InvalidOfferId",
              },
              {
                index: 10,
                name: "LoanIsNotOpen",
              },
              {
                index: 11,
                name: "LoanIsNotActive",
              },
              {
                index: 12,
                name: "LoanHasNotExpired",
              },
              {
                index: 13,
                name: "LoanHasExpired",
              },
              {
                index: 14,
                name: "LoanRepaymentPeriodAlreadyOver",
              },
              {
                index: 15,
                name: "NotAuthorized",
              },
              {
                index: 16,
                name: "ZeroValue",
              },
              {
                index: 17,
                name: "OfferNotInPendingState",
              },
              {
                index: 18,
                name: "LoanLimitExceeding",
              },
              {
                index: 19,
                name: "OfferIsNotAccepted",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "Error"],
      },
    },
    {
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 16,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 16,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 8,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 17,
      type: {
        def: {
          primitive: "bool",
        },
      },
    },
    {
      id: 18,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 3,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 19,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 20,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 20,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 20,
      type: {
        def: {
          sequence: {
            type: 3,
          },
        },
      },
    },
    {
      id: 21,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 22,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 22,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 22,
      type: {
        def: {
          sequence: {
            type: 23,
          },
        },
      },
    },
    {
      id: 23,
      type: {
        def: {
          tuple: [3, 24, 25],
        },
      },
    },
    {
      id: 24,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: "borrower",
                type: 0,
                typeName: "AccountId",
              },
              {
                name: "token_id",
                type: 6,
                typeName: "TokenId",
              },
              {
                name: "shares_locked",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "amount_asked",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "security_deposit",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "loan_period",
                type: 4,
                typeName: "Time",
              },
              {
                name: "listing_timestamp",
                type: 4,
                typeName: "Time",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "LoanMetadata"],
      },
    },
    {
      id: 25,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: "start_timestamp",
                type: 26,
                typeName: "Option<Time>",
              },
              {
                name: "raised",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "limit_left",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "interest",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "repaid",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "loan_status",
                type: 27,
                typeName: "LoanStatus",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "LoanStats"],
      },
    },
    {
      id: 26,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "None",
              },
              {
                fields: [
                  {
                    type: 4,
                  },
                ],
                index: 1,
                name: "Some",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 4,
          },
        ],
        path: ["Option"],
      },
    },
    {
      id: 27,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "OPEN",
              },
              {
                index: 1,
                name: "ACTIVE",
              },
              {
                index: 2,
                name: "CLOSED",
              },
              {
                index: 3,
                name: "CANCELLED",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "LoanStatus"],
      },
    },
    {
      id: 28,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 29,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 29,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 29,
      type: {
        def: {
          sequence: {
            type: 30,
          },
        },
      },
    },
    {
      id: 30,
      type: {
        def: {
          tuple: [3, 31],
        },
      },
    },
    {
      id: 31,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: "lender",
                type: 0,
                typeName: "AccountId",
              },
              {
                name: "amount",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "interest",
                type: 3,
                typeName: "Balance",
              },
              {
                name: "status",
                type: 32,
                typeName: "OfferStatus",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "OfferMetadata"],
      },
    },
    {
      id: 32,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "PENDING",
              },
              {
                index: 1,
                name: "ACCEPTED",
              },
              {
                index: 2,
                name: "REJECTED",
              },
              {
                index: 3,
                name: "WITHDRAWN",
              },
            ],
          },
        },
        path: ["nft_lending", "nft_lending", "OfferStatus"],
      },
    },
    {
      id: 33,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 34,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 34,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 34,
      type: {
        def: {
          sequence: {
            type: 35,
          },
        },
      },
    },
    {
      id: 35,
      type: {
        def: {
          tuple: [3, 3],
        },
      },
    },
    {
      id: 36,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 37,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 37,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 37,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 24,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 24,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 38,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 39,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 39,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 39,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 25,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 25,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 40,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 41,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 41,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 41,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 42,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 42,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 42,
      type: {
        def: {
          tuple: [24, 25],
        },
      },
    },
    {
      id: 43,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 44,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 44,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 44,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 31,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 31,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 45,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 46,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 46,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 46,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 35,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 14,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 35,
          },
          {
            name: "E",
            type: 14,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 47,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 5,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 48,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 49,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 49,
          },
          {
            name: "E",
            type: 9,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 49,
      type: {
        def: {
          tuple: [3, 3, 3],
        },
      },
    },
  ],
  version: "4",
};
