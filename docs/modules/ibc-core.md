---
title: IBC core
description: "IBC clients, connections, and channels: query ibc and tx ibc for core handshake operations."
---

The **IBC core** module implements the **transport, authentication, and ordering** layer for interchain messaging (clients, connections, channels).

**CLI root**: `safrochaind query ibc` and `safrochaind tx ibc`

## Query commands (top level)

- `client` (client states, consensus states, clients)
- `connection` (connections, paths)
- `channel` (channel ends, sequences, packets)

Each branch has many subcommands. List them with:

```bash
safrochaind query ibc client --help
safrochaind query ibc connection --help
safrochaind query ibc channel --help
```

## Transaction commands (top level)

- `client` (create, upgrade, submit misbehaviour, ibc-go updates)
- `channel` (handshake steps)

Use `safrochaind tx ibc client --help` and `safrochaind tx ibc channel --help` for relayer-oriented workflows.

Practical relayer setup for Safrochain is covered in [IBC overview](../ibc/overview.md) and [Hermes setup](../ibc/hermes-setup.md).
