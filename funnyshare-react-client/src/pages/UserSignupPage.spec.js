import React from 'react';
import { render, fireEvent, waitFor, findByText, getByText } from '@testing-library/react';
import { UserSignupPage } from './UserSignupPage';

describe('UserSignupPage', () => {

    describe('Layout', () => {
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignupPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });

        it('has input for dispaly name', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();    
        });

        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();    
        });

        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();    
        });

        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');    
        });

        it('has input for password confirmation', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordConfirmationInput = queryByPlaceholderText('Confirm your password');
            expect(passwordConfirmationInput).toBeInTheDocument();    
        });

        it('has password type for password confirmation', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordConfirmationInput = queryByPlaceholderText('Confirm your password');
            expect(passwordConfirmationInput.type).toBe('password');    
        });

        it('has submit button', () => {
            const { container } = render(<UserSignupPage />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();    
        });
    });

    describe('Interactions', () => {

        const changeEvent = content => {
            return {
                target: {
                    value: content
                }
            }
        };

        const mockAsyncDelayed = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                         resolve({});
                    }, 300)
                })
            })
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordConfirmationInput;

        const setupForSubmit = props => {

            const rendered = render(<UserSignupPage {...props} />);

            const { container, queryByPlaceholderText } = rendered;

            displayNameInput = queryByPlaceholderText('Your display name');
            usernameInput = queryByPlaceholderText('Your username');
            passwordInput = queryByPlaceholderText('Your password');
            passwordConfirmationInput = queryByPlaceholderText('Confirm your password');

            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            fireEvent.change(usernameInput, changeEvent('my-username'));
            fireEvent.change(passwordInput, changeEvent('P4assword'));
            fireEvent.change(passwordConfirmationInput, changeEvent('P4assword'));

            button = container.querySelector('button');

            return rendered;
        };

        it('sets the displayName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');

            fireEvent.change(displayNameInput, changeEvent('my-display-name'));

            expect(displayNameInput).toHaveValue('my-display-name');
        });

        it('sets the username value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const usernameInput = queryByPlaceholderText('Your username');

            fireEvent.change(usernameInput, changeEvent('my-username'));

            expect(usernameInput).toHaveValue('my-username');
        });


        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');

            fireEvent.change(passwordInput, changeEvent('P4assword'));

            expect(passwordInput).toHaveValue('P4assword');
        });

        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordConfirmationInput = queryByPlaceholderText('Confirm your password');

            fireEvent.change(passwordConfirmationInput, changeEvent('P4assword'));

            expect(passwordConfirmationInput).toHaveValue('P4assword');
        });

        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }

            setupForSubmit({ actions });

            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);

        });

        it('does not throw exception when clicking the button when actions are not provided in props', () => {
            setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }

            setupForSubmit({ actions });
            fireEvent.click(button);

            const expectedUserObject = {
                username: 'my-username',
                displayName: 'my-display-name',
                password: 'P4assword',
            }

            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
        });

        it('does not allow user to click sign up button when there is an outgoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            }

            setupForSubmit({ actions });
            fireEvent.click(button);

            fireEvent.click(button);

            expect(actions.postSignup).toHaveBeenCalledTimes(1);

        });

        it('dispalys a spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            }

            const {queryByText} = setupForSubmit({ actions });

            fireEvent.click(button);

            const spinner = queryByText('Loading...');

            expect(spinner).toBeInTheDocument();
        });

        it('hides a spinner when the api call finishes successfully ', async () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            }

            const {queryByText} = setupForSubmit({ actions });

            fireEvent.click(button);

            await waitFor(() => {
                expect(queryByText('Loading...')).not.toBeInTheDocument()
            })
        });

        it('hides a spinner when the api call finishes with error ', async () => {
            const actions = {
                postSignup: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                             reject({
                                 response: {data: {}}
                             });
                        }, 300)
                    })
                })
            }

            const {queryByText} = setupForSubmit({ actions });

            fireEvent.click(button);

            await waitFor(() => {
                expect(queryByText('Loading...')).not.toBeInTheDocument()
            })
        });


        it('dispalys validation error for displayName when error is received for the field', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Cannot be null'
                            }
                        }
                    }
                })
            };

            const {queryByText} = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitFor(() => {
                expect(queryByText('Cannot be null')).toBeInTheDocument()
            })
        });

        it('enables the signup button when password and confirm password have the same value', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        });

        it('disables the signup button when confirm password does not match password', () => {
            setupForSubmit();
            fireEvent.change(passwordConfirmationInput, changeEvent("new-pass"))
            expect(button).toBeDisabled();
        });

        it('disables the signup button when password does not match confirm password', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent("new-pass"))
            expect(button).toBeDisabled();
        });

        it('displays error style for password repeat input when password repeat mismatch', () => {
            const { queryByText } = setupForSubmit();
            fireEvent.change(passwordConfirmationInput, changeEvent("new-pass"));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        });

        it('displays error style for password input when password input mismatch', () => {
            const { queryByText } = setupForSubmit();
            fireEvent.change(passwordInput, changeEvent("new-pass"));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        });

        it('hides validation error when user changes the content of displayName ', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Cannot be null'
                            }
                        }
                    }
                })
            };

            const { getByText, queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitFor(() => {
                expect(getByText('Cannot be null')).toBeInTheDocument();
            })

            fireEvent.change(displayNameInput, changeEvent("displayName updated"));

            expect(queryByText('Cannot be null')).not.toBeInTheDocument()
        });

        it('hides validation error when user changes the content of username ', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                username: 'Cannot be null'
                            }
                        }
                    }
                })
            };

            const { getByText, queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitFor(() => {
                expect(getByText('Cannot be null')).toBeInTheDocument();
            })

            fireEvent.change(usernameInput, changeEvent("username updated"));

            expect(queryByText('Cannot be null')).not.toBeInTheDocument()
        });

        it('hides validation error when user changes the content of password ', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                password: 'Cannot be null'
                            }
                        }
                    }
                })
            };

            const { getByText, queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitFor(() => {
                expect(getByText('Cannot be null')).toBeInTheDocument();
            })

            fireEvent.change(passwordInput, changeEvent("password updated"));

            expect(queryByText('Cannot be null')).not.toBeInTheDocument()
        });

        it('redirects to HomePage after succesful signup ', async () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValue({})
            };

            const history = {
                push: jest.fn()
            };

            setupForSubmit({ actions, history });

            fireEvent.click(button);

            await waitFor(() => {
                expect(history.push).toHaveBeenCalledWith('/');
            });
        });
    });
});

console.error = () => {};