# Genworlds Community Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/) [![Discord](https://dcbadge.vercel.app/api/server/VpfmXEMN66?compact=true&style=flat)](https://discord.gg/VpfmXEMN66) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/yeagerai.svg?style=social&label=Follow%20%40YeagerAI)](https://twitter.com/yeagerai) [![GitHub star chart](https://img.shields.io/github/stars/yeagerai/genworlds-community?style=social)](https://star-history.com/#yeagerai/genworlds-community)

**Yeager Support:** We are standing by to provide extensive support as your GenWorlds project transitions to the production phase or If you are an enterprise looking to work directly with Yeager.ai to build custom GenAI applications. Please complete [this short form](https://share.hsforms.com/1EO76EZ_CTDGCiqRYtdpkJwc4zk8) and we will get back to you shortly.

## About GenWorlds Community Edition

GenWorlds Community Edition is your toolkit for building and fine-tuning unique multi-agent systems using [the genworlds framework](https://github.com/yeagerai/genworlds). It consists of a frontend developed in Vue, that can be connected to any world that is a `ChatInterfaceWorld`, provided in the basic utility layer of genworlds. More info about `ChatInterfaceWorld` can be found [here](https://github.com/yeagerai/genworlds/blob/main/genworlds/worlds/concrete/community_chat_interface/world.py).

GenWorlds Community uses The GenWorlds Framework as its core. For more information please visit [The Docs](https://genworlds.com/docs/get-started/intro).

### Chat Interface World: A Novel Approach to Multi-User Chat Environments

The Chat Interface World is not only a basic world that can contain all sorts of objects, and agents but also manages a series of actions that send events transmitting configurations for chat rooms to the frontend.

In a professional protocol environment, like the one utilized by GenWorlds-Community, a frontend - `vue-gui/` - is provided, which enables rendering of content while staying connected to a Chat Interface World.

To develop using this new strategy:

1. Clone the repo.
2. Launch your world using Python or Jupyter Notebook.
3. Go to the vue-gui folder and execute `yarn install` if is the first time you use the repo.
4. Execute `yarn serve` to launch the frontend which will, in turn, try to connect to the world, receiving the event with the screen configurations and subsequently displaying them.

Check out the `use-cases/` folder of this repository for examples.

## Key Features

- **Full Stack for your custom multi-agent system:** Use your GenWorld as a backend, and the provided vue-gui as your frontend.
- **Run Anywhere:** Easily launch GenWorlds Community Edition through Docker or just plain from your terminal.
- **Fine-tune Your World:** Create more [custom agents](https://genworlds.com/docs/tutorials/first_custom_agent) and [objects](https://genworlds.com/docs/genworlds-framework/objects) and attach it to you world to find the perfect mix between deterministic and non-deterministic processes.

## 🛠️ Getting Started

### Running it locally

To set up and run GenWorlds Community Edition locally, use the following commands:

```sh
git clone git@github.com:yeagerai/genworlds-community.git
```

Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys.

Then open a `jupyter-notebook` and go to `use_cases/quickstart/quickstart.ipynb` and run all the cells.

After that, to install the dependencies and run the frontend server:

```sh
cd vue-gui
yarn install
yarn serve
```

Finally, you can open your browser and go to `http://localhost:8080/`. Start interacting with your world typing `/` on the textbox.

Here is a video of the process, after we have executed the `git clone` command:

[![GenWorlds Community Initial Setup](https://img.youtube.com/vi/0amH15NkAb8/maxresdefault.jpg
)](https://www.youtube.com/watch?v=0amH15NkAb8)

And you can create new `ChatInterfaceWorld`(s) inside the `use_cases/` folder to adapt it to your particular use-case.

For more detailed information of how to use the framework, you can check the [GenWorlds Docs](https://genworlds.com/docs/get-started/intro).

### Running with Docker (under development, so not working yet)

To set up and run GenWorlds Community Edition with Docker, use the following commands:

```sh
git clone git@github.com:yeagerai/genworlds-community.git
```

Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys.

After that, to build and run the image:

```sh
docker build -t genworlds-world-app -f ./docker/Dockerfile .
docker run -p 80:80 -p 7456:7456 -d genworlds-world-app
```

Finally, you can open your browser and go to `http://localhost/`

#### Setting the API keys

##### OpenAI

When you first run a use_case, you will see a pre-recorded history of a conversation.

To run a real simulation, you need to set your OpenAI API key. It can be found at [OpenAI Platform](https://platform.openai.com/account/api-keys). The RoundTable uses GPT4.

Set the OpenAI API key by clicking the cog icon at top right.

## Creating your own Worlds

The [GenWorlds framework](https://github.com/yeagerai/genworlds) is a powerful set of tools for creating your own worlds of agents and objects that go far beyond the RoundTable use case.

See the [Tutorials](https://genworlds.com/docs/category/tutorials) to get started with some examples.

## Contributing

As an open-source project in a rapidly developing field, we are extremely open to contributions, whether it be in the form of a new feature, improved infrastructure, or better documentation. Please read our [CONTRIBUTING](https://github.com/yeagerai/genworlds-community/blob/main/CONTRIBUTING.md) for guidelines on how to submit your contributions.

As the framework is in alpha, expect large changes to the codebase.

## License

🧬🌍 GenWorlds is released under the MIT License. Please see the [LICENSE file](https://github.com/yeagerai/genworlds-community/blob/main/LICENSE) for more information.

## Disclaimer

This software is provided 'as-is', without any guarantees or warranties. By using GenWorlds Community, you agree to assume all associated risks, including but not limited to data loss, system issues, or any unforeseen challenges.

The developers and contributors of GenWorlds Community are not responsible for any damages, losses, or consequences that may arise from its use. You alone are responsible for any decisions and actions taken based on the information or results produced by GenWorlds Community.

Be mindful that usage of AI models, like GPT-4, can be costly due to their token usage. By using GenWorlds Community, you acknowledge that you are responsible for managing your own token usage and related costs.

As an autonomous system, GenWorlds Community may produce content or execute actions that may not align with real-world business practices or legal requirements. You are responsible for ensuring all actions or decisions align with all applicable laws, regulations, and ethical standards.

By using GenWorlds Community, you agree to indemnify, defend, and hold harmless the developers, contributors, and any associated parties from any claims, damages, losses, liabilities, costs, and expenses (including attorney's fees) that might arise from your use of this software or violation of these terms.
