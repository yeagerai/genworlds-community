import csv
import yaml
import sys
from yaml.representer import Representer
import re
def str_presenter(dumper, data):
  if len(data.splitlines()) > 1:  # check for multiline string
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='>')
  return dumper.represent_scalar('tag:yaml.org,2002:str', data)



# Enable literal style block for multiline strings
yaml.add_representer(str, str_presenter)

def id_from_name(name):
    return re.sub(r'\W+', '_', name.lower())

def split_and_filter_lines(string):
    return [line.strip().lstrip("- ").lstrip("• ") for line in string.splitlines() if line.strip().lstrip("- ").lstrip("• ")]

def main(input_file):
    with open(input_file, 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        roundtable_name = None
        description = None
        world_data = None

        for row in reader:
            new_roundtable = False
            if row['roundtable_name']:
                if world_data:  # if this is not the first roundtable, save to file                    
                    print(id_from_name(roundtable_name))
                    with open(f'{id_from_name(roundtable_name)}.yaml', 'w') as yaml_file:
                        yaml.dump({"world_definition": world_data}, yaml_file, sort_keys=False)

                roundtable_name = row['roundtable_name']
                new_roundtable = True
            if row['description']:
                description = row['description']

            if new_roundtable and roundtable_name:
                world_data = {
                    "base_args": {
                        "websocket_url": "ws://real-ws:7456/ws",
                    },
                    "world": {
                        "id": "world",
                        "class": "genworlds.worlds.world_2d.world_2d.World2D",
                        "name": roundtable_name,
                        "description": description,
                        "locations": ["roundtable"],
                        "objects": [
                            {
                                "id": "mic1",
                                "class": "use_cases.roundtable.objects.microphone.Microphone",
                                "name": "Microphone",
                                "description": """A podcast microphone that allows the holder of it to speak to the audience. The speaker can choose to make a statement, ask a question, respond to a question, or make a joke.""",
                                "host": id_from_name(row["agent_name"]),
                                "world_properties": {"held_by": id_from_name(row["agent_name"])},
                            }
                        ],
                        "agents": [],
                        "base_agent": {
                            "topic_of_conversation": row["topic_of_conversation"],
                            "goals": split_and_filter_lines(row["world_goals"]),
                            "evaluation_principles": [
                                "Be engaging, clear and didactical",
                            ],
                            "constraints": [
                                "Only the holder of the microphone can speak to the audience, if you don't have the microphone in your inventory, wait to receive it from the previous speaker",
                                "Don't repeat yourself, ask insightful questions to the guests of the podcast to advance the conversation",
                                "Don't hog the microphone for a long time, make sure to give it to other participants",
                                "If you have asked a question, make sure to give the microphone to the guest so they can answer",
                                "If you have completed your statement, make sure to give the microphone to the next speaker",
                                "Do not wait if you still have the microphone, speak or pass the microphone to the next speaker",
                            ],
                        },
                    }
                }

                if row['path_to_external_memory']:
                    world_data["world"]["path_to_external_memory"] = row['path_to_external_memory']

            agent = {
                "id": id_from_name(row["agent_name"]),
                "class": "use_cases.roundtable.agents.roundtable_agent.RoundtableAgent",
                "name": row["agent_name"],
                "role": row["role"],
                "background": row["background"],
                "personality": row["personality"],
                "communication_style": row["communication_style"],
                "agent_goals": split_and_filter_lines(row["agent_goals"]),
                "constraints": [],
                "evaluation_principles": [],
                "world_properties": {"location": "roundtable"},
            }

            if row["personality_db_collection_name"]:
                agent["personality_db_collection_name"] = row["personality_db_collection_name"]

            world_data["world"]["agents"].append(agent)
            print(f'Added agent {agent["id"]} to roundtable {roundtable_name}')

        # Save the last roundtable
        if world_data:
            with open(f'{id_from_name(roundtable_name)}.yaml', 'w') as yaml_file:
                yaml.dump({"world_definition": world_data}, yaml_file, sort_keys=False)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py input.csv")
        sys.exit(1)

    main(sys.argv[1])
