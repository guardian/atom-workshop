import React from "react";

export const wordLimits = {
  default: 400,
  qanda: 250,
};

export const tooLongMsg = wordLimit => (
  <div>
    Heads up.{" "}
    <strong>You&apos;ve exceeded the {wordLimit} word limit for this field.</strong>{" "}
    You can still publish it, but bear in mind that atoms should be concise.
  </div>
);
