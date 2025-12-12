export const generateCodeBoxes = (code: string) => {
  return code
    .split("")
    .map(
      (digit) => `
    <td style="padding: 0 6px; width: 70px; height: 80px; border: 2px solid #5B6EF5; border-radius: 8px; background-color: #F8F9FF; text-align: center; vertical-align: middle; font-size: 48px; font-weight: 700; color: #000000;">
      ${digit}
    </td>
    `
    )
    .join("");
};
