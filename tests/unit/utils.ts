export function key(eventValue: string): KeyboardEvent {
    return new KeyboardEvent('keydown', {key: eventValue});
}

export function click(): MouseEvent {
    return new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    });
}

