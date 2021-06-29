import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from './Input'

describe('Layout', () => {

    it('has input item', () => {
        const { container } = render(<Input />);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();
    });

    it('displays the label provided in props', () => {
        const { queryByText } = render(<Input label="Test label" />);
        const label = queryByText("Test label");
        expect(label).toBeInTheDocument();
    });

    it('does not dispaly the label when not label provided in props', () => {
        const { container } = render(<Input />);
        const label = container.querySelector("label");
        expect(label).not.toBeInTheDocument();
    });

    it('has text type for input when type is not privded as prop', () => {
        const { container } = render(<Input />);
        const input = container.querySelector('input');
        expect(input.type).toBe("text");
    });

    it('has password type for input when password type is privded as prop', () => {
        const { container } = render(<Input type="password" />);
        const input = container.querySelector('input');
        expect(input.type).toBe("password");
    });

    it('displays placeholder when it is privded as prop', () => {
        const { container } = render(<Input placeholder="Test placeholder" />);
        const input = container.querySelector('input');
        expect(input.placeholder).toBe("Test placeholder");
    });

    it('has name for input when it is provided in props', () => {
        const { container } = render(<Input name="Test name" />);
        const input = container.querySelector('input');
        expect(input.name).toBe("Test name");
    });

    it('has value for input when it is provided in props', () => {
        const { container } = render(<Input value="Test value" />);
        const input = container.querySelector('input');
        expect(input.value).toBe("Test value");
    });

    it('has onChange callback when it is provided in props', () => {
        const onChange = jest.fn();
        const { container } = render(<Input onChange={onChange} />);
        const input = container.querySelector('input');

        fireEvent.change(input, {target:{value: 'new-input'}});
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('has default style when there is no validation error or success', () => {
        const { container } = render(<Input />);
        const input = container.querySelector('input');
        expect(input.className).toBe("form-control");
    });

    it('has success style when hasError property is false', () => {
        const { container } = render(<Input hasError={false}/>);
        const input = container.querySelector('input');
        expect(input.className).toBe("form-control is-valid");
    });

    it('has error style when hasError property is true', () => {
        const { container } = render(<Input hasError={true}/>);
        const input = container.querySelector('input');
        expect(input.className).toBe("form-control is-invalid");
    });

    it('dispalys the error text when it is provided', () => {
        const { queryByText } = render(
            <Input hasError={true} error="Cannot be null"/>
        );

        expect(queryByText("Cannot be null")).toBeInTheDocument();
    });

    it('dispalys the error text when it is provided', () => {
        const { queryByText } = render(
            <Input hasError={true} error="Cannot be null"/>
        );

        expect(queryByText("Cannot be null")).toBeInTheDocument();
    });

    it('does not dispalys the error text when hasError it is not provided', () => {
        const { queryByText } = render(
            <Input error="Cannot be null"/>
        );

        expect(queryByText("Cannot be null")).not.toBeInTheDocument();
    });

})
