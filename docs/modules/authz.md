---
title: Authz
description: "Generic authorizations to execute messages on someone else's behalf: query and tx authz."
---

The **authz** module provides **generic authorizations**: one account (**granter**) delegates permission for specific message types to another (**grantee**).

**CLI root**: `safrochaind query authz` and `safrochaind tx authz`

## Query commands

- `grants`
- `grants-by-grantee`
- `grants-by-granter`

## Transaction commands

- `grant`, `revoke`, `exec`

## Example

```bash
safrochaind tx authz grant addr_safro1grantee... generic \
  --msg-type=/cosmos.bank.v1beta1.MsgSend \
  --from granter --chain-id safrochain-testnet-1 --fees 5000usaf -y
```

Use `safrochaind tx authz exec --help` when executing an authorized message.
