const NANO_ADDRESS_PATTERN = /^(nano|xrb)_[13][13456789abcdefghijkmnopqrstuwxyz]{59}$/;

export function isNanoAddress(value: string) {
  return NANO_ADDRESS_PATTERN.test(value.trim());
}

export const nanoAddressPattern = "(nano|xrb)_[13][13456789abcdefghijkmnopqrstuwxyz]{59}";
