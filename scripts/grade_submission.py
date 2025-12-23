import sys
import json
from grading_algorithm import calculate_total_score

def count_lines_of_code(code_str):
    """Counts non-empty, non-comment lines of Python code."""
    if not isinstance(code_str, str):
        return 0
    lines = code_str.strip().split('\n')
    count = 0
    for line in lines:
        stripped_line = line.strip()
        if stripped_line and not stripped_line.startswith('#'):
            count += 1
    return count

def main():
    """
    Main function to grade a submission.
    It reads submission data from stdin, calculates the score using the grading_algorithm,
    and prints the result to stdout.
    """
    try:
        # Read all data from stdin
        input_str = sys.stdin.read()
        if not input_str:
            print(json.dumps({"error": "No input received from stdin."}), file=sys.stderr)
            sys.exit(1)
            
        submission_data = json.loads(input_str)

        # --- Extract data from submission ---
        difficulty = submission_data.get("difficulty", "easy")
        speed_ms = submission_data.get("execution_time_ms", 3) # Default to a higher value if not present
        code = submission_data.get("code", "")

        # --- Determine expected values (these would typically come from a DB) ---
        # Using defaults from the old script as placeholders
        expected_loc = submission_data.get("optimal_loc", 20)
        expected_complexity = submission_data.get("expected_complexity", "O(n)")
        
        # The 'actual' complexity from the user's code. This is hard to determine
        # automatically. We'll assume it's passed in for now.
        actual_complexity = submission_data.get("user_complexity", "O(n^2)")

        # --- Calculate actual values from submission ---
        actual_loc = count_lines_of_code(code)

        # --- Calculate the score using the dedicated algorithm ---
        result = calculate_total_score(
            difficulty=difficulty,
            speed_ms=speed_ms,
            actual_complexity=actual_complexity,
            expected_complexity=expected_complexity,
            actual_loc=actual_loc,
            expected_loc=expected_loc
        )
        
        # Output result as JSON to stdout
        print(json.dumps(result, indent=4))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": "Invalid JSON input.", "details": str(e)}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": "An unexpected error occurred.", "details": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
