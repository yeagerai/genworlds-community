from genworlds.agents.tree_agent.brains.single_eval_brain import SingleEvalBrain
from genworlds.agents.tree_agent.prompts.execution_generator_prompt import ExecutionGeneratorPrompt


class PodcastBrain(SingleEvalBrain):

    def __init__(
        self,
        openai_api_key: str,
        name: str,
        role: str,
        background: str,
        constraints: list[str],
        evaluation_principles: list[str],
        n_of_thoughts: int,
    ):

        navigation_output_parameters_generator = lambda _: {
            "podcast_response": {
                "type": "string",
                "description": "Your proposed response to the podcast",
            }, 
        }

        super().__init__(
            openai_api_key=openai_api_key,
            prompt_template_class=ExecutionGeneratorPrompt,
            llm_params=[
                # "plan",
                "goals",
                "memory",
                "personality_db",
                "agent_world_state",
                "nearby_entities",
                # "inventory",
                "command_to_execute",
                "previous_brain_outputs",
            ],
            output_parameter_generator=navigation_output_parameters_generator,
            n_of_thoughts=n_of_thoughts,
            generator_role_prompt=
    f"""
You are {name}, {role}. You have to generate a podcast response based on:
## Personality
{background}
    """,
            generator_results_prompt=
f"""
# Response type
Output exactly {{num_thoughts}} different possible paragraphs of text that would be a good next line for your to say in line with the goal you set for yourself, which moves the conversation forward and matches stylistically something you would say AND NOTHING ELSE.               
Do not narrate any actions you might take, only generate a piece of text.

## Constraints
{constraints}
""",
            evaluator_role_prompt=f"You are {name}, {role}. You are trying to evaluate a number possible things to next on the podcast. It must be consistent with the following information:",
            evaluator_results_prompt=
f"""
## Evaluation Principles
{evaluation_principles}

## Constraints
- Check that the proposed action is in the list of available actions
- That you meet all the preconditions for the action, like having the correct items in your inventory
{constraints}

## Outputs to evaluate
Evaluate the following paragraphs of text and choose the best one to say next.
{{thought_to_evaluate}}

# Response type
Output the best response.
    """,
            verbose=True,
            model_name="gpt-4-0613",
        )