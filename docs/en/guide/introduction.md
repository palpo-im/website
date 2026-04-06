# Palpo

Palpo is a high-performance, scalable implementation of a Matrix Homeserver.

## What is Matrix?

Matrix is an open standard and protocol for secure, decentralized real-time communication. It provides a federated network where users on different servers can seamlessly chat, make voice and video calls, and share files — all with strong end-to-end encryption. Think of it as an open alternative to proprietary messaging platforms.

Key features of the Matrix protocol:

- **Decentralized** — No single point of control; anyone can run their own server and still communicate with the wider network.
- **End-to-End Encryption** — Private conversations stay private, secured by the Olm/Megolm cryptographic protocols.
- **Interoperability** — Bridges allow Matrix users to communicate with users on other platforms such as Slack, Discord, and IRC.

For a deeper dive into the protocol, visit [matrix.org](https://matrix.org/).

## Why Choose Palpo?

- **Built with Rust** — Palpo is written in Rust, providing memory safety, high concurrency, and excellent runtime performance without the overhead of a garbage collector.
- **High Performance** — Designed to handle large numbers of users and messages with minimal resource consumption.
- **Scalable** — A modular architecture makes it easy to extend and add new features as your needs grow.
- **Secure** — Full support for end-to-end encryption to keep your communications safe.
- **Easy Deployment** — Multiple deployment options including Docker, Kubernetes, and standalone binaries.

## Is Palpo Right for You?

Palpo is a good fit if you want:

- A lightweight, resource-efficient Matrix homeserver for personal use or small-to-medium communities.
- A Rust-based server with strong performance characteristics.
- Simple deployment and low operational overhead.

If you need a battle-tested server with the widest ecosystem support, you may also want to evaluate [Synapse](https://github.com/element-hq/synapse) (the reference Python implementation) or [Dendrite](https://github.com/element-hq/dendrite) (written in Go).

Ready to get started? Head to the [Quick Start](./quick-start.md) guide.