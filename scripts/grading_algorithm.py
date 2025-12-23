
import sys
import json

# Define the weights for each grading parameter
WEIGHTS = {
    'execution_speed': 0.4,
    'time_complexity': 0.4,
    'lines_of_code': 0.2
}

# Define the maximum marks for each difficulty level
MAX_MARKS = {
    'easy': 10,
    'medium': 20,
    'hard': 30
}

# Define a numerical representation for time complexities to allow comparison
COMPLEXITY_RANKS = {
    'O(1)': 0,
    'O(log n)': 1,
    'O(n)': 2,
    'O(n log n)': 3,
    'O(n^2)': 4,
    'O(n^3)': 5,
    'O(2^n)': 6,
    'O(n!)': 7
}

def calculate_speed_score(speed_ms, max_speed_marks):
    """
    Calculates the score for execution speed.
    - 0ms: 100%
    - 1ms: 80%
    - 2ms: 60%
    - 3ms+: 50%
    """
    if speed_ms == 0:
        return max_speed_marks
    elif speed_ms == 1:
        return max_speed_marks * 0.8
    elif speed_ms == 2:
        return max_speed_marks * 0.6
    else:
        return max_speed_marks * 0.5

def calculate_complexity_score(actual_complexity, expected_complexity, max_complexity_marks):
    """
    Calculates the score for time complexity based on how far the
    actual complexity is from the expected one.
    """
    actual_rank = COMPLEXITY_RANKS.get(actual_complexity, float('inf'))
    expected_rank = COMPLEXITY_RANKS.get(expected_complexity, float('inf'))
    
    if actual_rank <= expected_rank:
        return max_complexity_marks
    
    rank_difference = actual_rank - expected_rank
    if rank_difference == 1:
        return max_complexity_marks * 0.75
    elif rank_difference == 2:
        return max_complexity_marks * 0.5
    else:
        return max_complexity_marks * 0.25

def calculate_loc_score(actual_loc, expected_loc, max_loc_marks):
    """
    Calculates the score for lines of code (LOC).
    The score is penalized based on how much the actual LOC exceeds the expected LOC.
    """
    if actual_loc <= expected_loc:
        return max_loc_marks
    
    ratio = actual_loc / expected_loc
    if ratio <= 1.2:
        return max_loc_marks * 0.8
    elif ratio <= 1.5:
        return max_loc_marks * 0.6
    else:
        return max_loc_marks * 0.4

def calculate_total_score(difficulty, speed_ms, actual_complexity, expected_complexity, actual_loc, expected_loc):
    """
    Calculates the total score for a submission by combining the scores
    from all three parameters.
    """
    total_marks = MAX_MARKS.get(difficulty.lower())
    if total_marks is None:
        raise ValueError(f"Invalid difficulty level: {difficulty}")

    # Calculate the maximum marks available for each category
    max_speed_marks = total_marks * WEIGHTS['execution_speed']
    max_complexity_marks = total_marks * WEIGHTS['time_complexity']
    max_loc_marks = total_marks * WEIGHTS['lines_of_code']
    
    # Calculate the actual score for each category
    speed_score = calculate_speed_score(speed_ms, max_speed_marks)
    complexity_score = calculate_complexity_score(actual_complexity, expected_complexity, max_complexity_marks)
    loc_score = calculate_loc_score(actual_loc, expected_loc, max_loc_marks)
    
    # Sum up the scores and round to a reasonable precision
    total_score = round(speed_score + complexity_score + loc_score, 2)
    
    return {
        "total_score": total_score,
        "max_marks": total_marks,
        "details": {
            "execution_speed": {"score": round(speed_score, 2), "max": round(max_speed_marks, 2)},
            "time_complexity": {"score": round(complexity_score, 2), "max": round(max_complexity_marks, 2)},
            "lines_of_code": {"score": round(loc_score, 2), "max": round(max_loc_marks, 2)}
        }
    }

if __name__ == "__main__":
    # This part allows the script to be called from the command line,
    # expecting a JSON string as an argument.
    # Example usage:
    # python grading_algorithm.py '{"difficulty": "medium", "speed_ms": 1, "actual_complexity": "O(n)", "expected_complexity": "O(n)", "actual_loc": 15, "expected_loc": 12}'
    try:
        input_data = json.loads(sys.argv[1])
        
        result = calculate_total_score(
            difficulty=input_data["difficulty"],
            speed_ms=input_data["speed_ms"],
            actual_complexity=input_data["actual_complexity"],
            expected_complexity=input_data["expected_complexity"],
            actual_loc=input_data["actual_loc"],
            expected_loc=input_data["expected_loc"]
        )
        
        print(json.dumps(result, indent=4))
        
    except (IndexError, json.JSONDecodeError, KeyError) as e:
        print(f"Error: Invalid input. Please provide a valid JSON string with all required keys.", file=sys.stderr)
        print(f"Details: {e}", file=sys.stderr)
        sys.exit(1)