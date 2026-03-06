from typing import Set


def get_next_unlocked_day(completed_day_numbers: Set[int], total_days: int) -> int:
    next_day = 1
    for day_number in range(1, total_days + 1):
        if day_number in completed_day_numbers:
            next_day = day_number + 1
        else:
            break
    return min(next_day, total_days)
