import { useCallback, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';

import { InputLabel } from '@/auth/components/ui/InputLabel';
import { Logo } from '@/auth/components/ui/Logo';
import { Modal } from '@/auth/components/ui/Modal';
import { SubTitle } from '@/auth/components/ui/SubTitle';
import { Title } from '@/auth/components/ui/Title';
import { useAuth } from '@/auth/hooks/useAuth';
import { authFlowUserEmailState } from '@/auth/states/authFlowUserEmailState';
import { isMockModeState } from '@/auth/states/isMockModeState';
import { PrimaryButton } from '@/ui/components/buttons/PrimaryButton';
import { TextInput } from '@/ui/components/inputs/TextInput';
import { Companies } from '~/pages/companies/Companies';

const StyledContentContainer = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  padding-top: ${({ theme }) => theme.spacing(6)};
  width: 320px;
`;

const StyledInputContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(7)};
`;

const StyledErrorContainer = styled.div`
  color: ${({ theme }) => theme.color.red};
`;

export function PasswordLogin() {
  const navigate = useNavigate();
  const [, setMockMode] = useRecoilState(isMockModeState);

  const prefillPassword =
    process.env.NODE_ENV === 'development' ? 'applecar2025' : '';

  const [authFlowUserEmail, setAuthFlowUserEmail] = useRecoilState(
    authFlowUserEmailState,
  );
  const [internalPassword, setInternalPassword] = useState(prefillPassword);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();

  const handleLogin = useCallback(async () => {
    try {
      await login(authFlowUserEmail, internalPassword);
      setMockMode(false);
      navigate('/');
    } catch (err: any) {
      setFormError(err.message);
    }
  }, [authFlowUserEmail, internalPassword, login, navigate, setMockMode]);

  useHotkeys(
    'enter',
    () => {
      handleLogin();
    },
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
    [handleLogin],
  );

  return (
    <>
      <Companies />
      <Modal>
        <Logo />
        <Title>Welcome to Twenty</Title>
        <SubTitle>Enter your credentials to sign in</SubTitle>
        <StyledContentContainer>
          <StyledInputContainer>
            <InputLabel label="Email" />
            <TextInput
              value={authFlowUserEmail}
              placeholder="Email"
              onChange={(value) => setAuthFlowUserEmail(value)}
              fullWidth
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <InputLabel label="Password" />
            <TextInput
              value={internalPassword}
              placeholder="Password"
              onChange={(value) => setInternalPassword(value)}
              fullWidth
              type="password"
            />
            <StyledButtonContainer>
              <PrimaryButton fullWidth onClick={handleLogin}>
                Continue
              </PrimaryButton>
            </StyledButtonContainer>
          </StyledInputContainer>
          {formError && (
            <StyledErrorContainer>{formError}</StyledErrorContainer>
          )}
        </StyledContentContainer>
      </Modal>
    </>
  );
}
