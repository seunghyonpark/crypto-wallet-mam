import { ClaimEligibility } from "@thirdweb-dev/sdk";

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0
): string {
  if (!reasons.length) {
    return "";
  }

  const reason = reasons[0];

  if (
    reason === ClaimEligibility.Unknown ||
    reason === ClaimEligibility.NoActiveClaimPhase ||
    reason === ClaimEligibility.NoClaimConditionSet
  ) {

    return "This game is not ready to be betted.";

  } else if (reason === ClaimEligibility.NotEnoughTokens) {

    return "You don't have enough currency to bet.";

  } else if (reason === ClaimEligibility.AddressNotAllowed) {

    if (quantity > 1) {
      return `You are not eligible to bet ${quantity} tokens.`;
    }

    return "You are not eligible to mint at this time.";
  }

  return reason;
}
