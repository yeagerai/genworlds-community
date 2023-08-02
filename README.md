# Genworlds Community Edition

[![Run it on Replit](https://img.shields.io/badge/Replit-Run-0b1324?logo=Replit)](https://replit.com/@yeagerai/GenWorlds) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/) [![Discord](https://dcbadge.vercel.app/api/server/VpfmXEMN66?compact=true&style=flat)](https://discord.gg/VpfmXEMN66) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/yeagerai.svg?style=social&label=Follow%20%40YeagerAI)](https://twitter.com/yeagerai) [![GitHub star chart](https://img.shields.io/github/stars/yeagerai/genworlds-community?style=social)](https://star-history.com/#yeagerai/genworlds-community)

**Yeager Support:** We are standing by to provide extensive support as your GenWorlds project transitions to the production phase or If you are an enterprise looking to work directly with Yeager.ai to build custom GenAI applications. Please complete [this short form](https://share.hsforms.com/1EO76EZ_CTDGCiqRYtdpkJwc4zk8) and we will be get back to you shortly.

## About GenWorlds Community Edition

GenWorlds Community Edition is your toolkit for building and fine-tuning unique AI worlds. It consists of an array of backend and frontend services, including Vue, JavaScript, Redis, WebSockets, and more. You can launch GenWorlds Community Edition through Replit or Docker.

GenWorlds Community uses The GenWorlds Framework as its core. For more information please visit [The Docs](https://genworlds.com/docs/getting-started).

## Key Features

- **Backend and Frontend Services:** Use an array of technologies to power your AI world, including Vue, JavaScript, Redis, and WebSockets. For more information about the architecture [see this document](https://github.com/yeagerai/genworlds-community/blob/main/deployments/README.md).
- **Run Anywhere:** Easily launch GenWorlds Community Edition through Replit or Docker.
- **Fine-tune Your World:** Use our tools to customize your AI world to your needs.

## 🛠️ Getting Started

### Running with Replit

The easiest way to start using GenWorlds Community Edition is through Replit. Click [here](https://replit.com/@yeagerai/GenWorlds) to fork it and run it on Replit.

### Running with Docker

To set up and run GenWorlds Community Edition with Docker, use the following commands:

```sh
git clone git@github.com:yeagerai/genworlds-community.git
```

Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys.

After that, to build and run the image:

```sh
docker build -t genworlds-world-app -f ./deployments/docker/Dockerfile .
docker run -p 80:80 -p 9000:9000 -d genworlds-world-app
```

Finally, you can open your browser and go to `http://localhost/`

If you want the app to directly launch a specific use-case, you can add the following variable to the `.env` file:

```bash
VUE_APP_USE_CASE_ACCESS_POINT=/use_cases/roundtable/presidential_debate.yaml
```

And you can replace `roundtable` by any folder name in the `use_cases/` folder.

For more detailed information of how to use the framework, you can check the [GenWorlds Docs](https://genworlds.com/docs/getting-started).

#### Setting the API keys

##### OpenAI

When you first run a use_case, you will see a pre-recorded history of a conversation.

To run a real simulation, you need to set your OpenAI API key. It can be found at [OpenAI Platform](https://platform.openai.com/account/api-keys). The RoundTable uses GPT4.

Set the OpenAI API key by clicking the cog icon at top right.

##### Text-to-speech

The framework supports Text-to-speech using ([Eleven Labs](https://beta.elevenlabs.io/)).

Set the Eleven Labs API key by clicking the cog icon at top right.

The agents will use one of pre-defined voices. If you want to use your own custom voices, you can do so by setting the `eleven_labs_voice_id` in the [YAML world definition](#yaml-world-definition)

## Creating your own RoundTables

It is very easy to modify the existing roundtabales to change the topic of discussion or the participants.

### YAML World Definition

RoundTable defitnition files are found in [use_cases/roundtable/world_definitions](use_cases/roundtable/world_definitions).

> **Note**
> The `*.mocked_record.json` files are pre-recorded event histories that play back when a user hasn't set the API key, to help people get started. For your own use cases, you don't need to worry about these files.

Pick a YAML file to start from and edit it to fit your needs.

Of particular interest might be the sections `world_defintion/world/agents` and `world_defintion/world/base_agent/topic_of_conversation`.

The `base_agent` section is applied to every agent in the world, meanwhile the details of `agents` are particular to them - only the `name` and `background` are shared with other agents in the world.

The use case needs to be reloaded to apply the changes.

## Creating your own Worlds

The ([GenWorlds framework](https://github.com/yeagerai/genworlds)) is a powerful set of tools for creating your own worlds of agents and objects that go far beyond the RoundTable use case.

See the ([GenWorlds Developer Documentation](https://genworlds.com/docs/getting-started)) to get started.

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
