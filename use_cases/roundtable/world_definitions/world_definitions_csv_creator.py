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

def main(input_file):
    with open(input_file, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        roundtable = None
        description = None
        world_data = None

        for row in reader:
            new_roundtable = False
            if row['RoundTable']:
                roundtable = row['RoundTable']
                new_roundtable = True
            if row['Description']:
                description = row['Description']
            if new_roundtable and roundtable and description:
                if world_data:  # if this is not the first roundtable
                    with open(f'{id_from_name(roundtable)}.yaml', 'w') as yaml_file:
                        yaml.dump({"world_definition": world_data}, yaml_file, sort_keys=False)

                world_data = {
                    "base_args": {
                        "websocket_url": "ws://real-ws:7456/ws",
                    },
                    "world": {
                        "id": "world",
                        "class": "genworlds.worlds.world_2d.world_2d.World2D",
                        "name": roundtable,
                        "description": description,
                        "locations": ["roundtable"],
                        "objects": [
                            {
                                "id": "mic1",
                                "class": "use_cases.roundtable.objects.microphone.Microphone",
                                "name": "Microphone",
                                "description": """A podcast microphone that allows the holder of it to speak to the audience. The speaker can choose to make a statement, ask a question, respond to a question, or make a joke.""",
                                "host": id_from_name(row["Agents"]),
                                "world_properties": {"held_by": id_from_name(row["Agents"])},
                            }
                        ],
                        "agents": [],
                        "base_agent": {
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

            agent = {
                "id": id_from_name(row["Agents"]),
                "class": "use_cases.roundtable.agents.roundtable_agent.RoundtableAgent",
                "name": row["Agents"],
                "role": row["role"],
                "background": row["background"],
                "goals": [row["goals"]],
                "constraints": [],
                "evaluation_principles": [],
                "world_properties": {"location": "roundtable"},
            }
            world_data["world"]["agents"].append(agent)

        # Save the last roundtable
        if world_data:
            with open(f'{id_from_name(roundtable)}.yaml', 'w') as yaml_file:
                yaml.dump({"world_definition": world_data}, yaml_file, sort_keys=False)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py input.csv")
        sys.exit(1)

    main(sys.argv[1])
