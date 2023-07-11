# Genworlds Community Edition

## Usage

### From Replit

The easiest way to try out the Genworlds framework is with Replit.

Just go to [Replit Genworlds-Community Fork](https://replit.com/@yeagerai/genworlds-community) and click the RUN button.

### Setting the API keys

#### OpenAI

When you first run a use_case, you will see a pre-recorded history of a conversation.

To run a real simulation, you need to set your OpenAI API key. It can be found at [OpenAI Platform](https://platform.openai.com/account/api-keys). The RoundTable uses GPT4.

Set the OpenAI API key by clicking the cog icon at top right.

#### Text-to-speech

The framework supports Text-to-speech using ([Eleven Labs](https://beta.elevenlabs.io/)).

Set the Eleven Labs API key by clicking the cog icon at top right.

The agents will use one of pre-defined voices. If you want to use your own custom voices, you can do so by setting the `eleven_labs_voice_id` in the [YAML world definition](#yaml-world-definition)

### From local machine

From your local machine, run the following command:

```bash
git clone git@github.com:yeagerai/genworlds-community.git
```

Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys.

Then run the following commands:

First to build the docker image

```bash
docker build -t genworlds-world-app -f ./deployments/docker/Dockerfile .
```

And then to run it:

```bash
docker run -p 80:80 -p 9000:9000 -d genworlds-world-app
```

After that, you can open your browser and go to `http://localhost/`

If you want the app to directly launch a specific use-case, you can add the following variable to the `.env` file:

```bash
VUE_APP_USE_CASE_ACCESS_POINT=/use_cases/roundtable/presidential_debate.yaml
```

And you can replace `roundtable` by any folder name in the `use_cases/` folder.


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

See the ([GenWorlds Developer Documentation](https://genworlds.netlify.app/docs/intro)) to get started.