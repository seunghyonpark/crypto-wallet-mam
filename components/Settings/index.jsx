'use client';
import { Avatar } from '@/components/Avatar';

///import { Button } from '@/components/Button';
import Button from "@mui/material/Button";

import { Input, Textarea } from '@/components/Input';
import { Container, Spacer } from '@/components/LayoutNew';

import Wrapper from '@/components/LayoutNew/Wrapper';

import { fetcher } from '@/libs/fetch';

import { useCurrentUser } from '@/libs/user';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Settings.module.css';

//import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie } from 'cookies-next';


const EmailVerify = ({ user }) => {

  const [status, setStatus] = useState();

  const verify = useCallback(async () => {
    try {
      setStatus('loading');
      await fetcher('/api/gooduser/email/verify', { method: 'POST' });
      toast.success(
        'An email has been sent to your mailbox. Follow the instruction to verify your email.'
      );
      setStatus('success');
    } catch (e) {
      toast.error(e.message);
      setStatus('');
    }
  }, []);


  console.log("emailVerified=============", user?.emailVerified);


  /////if (user?.emailVerified) return null;


  return (

    <Container className={styles.note}>
      <Container flex={1}>
        <p>
          <strong>Note:</strong> <span>Your email</span> (
          <span className={styles.link}>{user?.email}</span>) is unverified.
        </p>
      </Container>
      <Spacer size={1} axis="horizontal" />
      <Button
        loading={status === 'loading'}
        size="small"
        onClick={verify}
        disabled={status === 'success'}
      >
        Verify
      </Button>
    </Container>

  );

};


const Auth = () => {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetcher('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPasswordRef.current.value,
          newPassword: newPasswordRef.current.value,
        }),
      });
      toast.success('Your password has been updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
    }
  }, []);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Password</h4>
      <form onSubmit={onSubmit}>
        <Input
          htmlType="password"
          autoComplete="current-password"
          ref={oldPasswordRef}
          label="Old Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Input
          htmlType="password"
          autoComplete="new-password"
          ref={newPasswordRef}
          label="New Password"
        />
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};


const AboutYou = ({ user, mutate }) => {
  const usernameRef = useRef();
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();

  const [avatarHref, setAvatarHref] = useState(user.profilePicture);
  const onAvatarChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setAvatarHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('username', usernameRef.current.value);
        formData.append('name', nameRef.current.value);
        formData.append('bio', bioRef.current.value);
        if (profilePictureRef.current.files[0]) {
          formData.append('profilePicture', profilePictureRef.current.files[0]);
        }
        const response = await fetcher('/api/user', {
          method: 'PATCH',
          body: formData,
        });
        mutate({ user: response.user }, false);
        toast.success('Your profile has been updated');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  useEffect(() => {
    usernameRef.current.value = user.username;
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
    profilePictureRef.current.value = '';
    setAvatarHref(user.profilePicture);
  }, [user]);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>About You</h4>
      <form onSubmit={onSubmit}>
        <Input ref={usernameRef} label="Your Username" />
        <Spacer size={0.5} axis="vertical" />
        <Input ref={nameRef} label="Your Name" />
        <Spacer size={0.5} axis="vertical" />
        <Textarea ref={bioRef} label="Your Bio" />
        <Spacer size={0.5} axis="vertical" />
        <span className={styles.label}>Your Avatar</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={user.username} url={avatarHref} />
          <input
            aria-label="Your Avatar"
            type="file"
            accept="image/*"
            ref={profilePictureRef}
            onChange={onAvatarChange}
          />
        </div>
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};


export const Settings = () => {
  const [user, setUser] = useState(null);


  ////const { data, error, mutate } = useCurrentUser();
  
  const router = useRouter();


  const [status, setStatus] = useState();
  

  const verify = useCallback(async () => {

    try {
      setStatus('loading');
      await fetcher('/api/gooduser/email/verify', { method: 'POST' });

      toast.success(
        'An email has been sent to your mailbox. Follow the instruction to verify your email.'
      );
      setStatus('success');

    } catch (e) {
      toast.error(e.message);
      setStatus('');
    }

  }, []);
  

  useEffect(() => {

    const getUser = async () => {
      const inputs = {
          method: 'getOne',
          API_KEY: process.env.API_KEY,
          userToken: getCookie('user')
      }
      const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs)
      })
      const user = await res.json();
      setUser(user?.user?.user);

      console.log("user======", user?.user?.user);

    }


      if (hasCookie('user')) {
          getUser()
      }
    
  }, [setUser])



  /*
  useEffect(() => {
    if (!data && !error) return;
    if (!data?.user) {
      router.replace('/myPage/login');
    }
  }, [router, data, error]);
  */


  return (

    <>
      <div className='flex flex-col items-center justify-center gap-5 w-full lg:w-2/3 text-white '>

          <p>
            <strong>Note:</strong> <span>Your email</span> (
            <span className="text-xl text-white">{user?.email}</span>) is unverified.
          </p>



          <Button
              onClick={() => {
                verify();
              }}
              variant="contained"
              color="secondary"
              className="bg-green-500 hover:bg-green-600 text-white text-center justify-center h-500 p-5 rounded-md "
              //loading={status === 'loading'}
              //disabled={status === 'success'}
          >
              Verify
          </Button>


{/*
      {data?.user ? (
        <>
          <EmailVerify user={data.user} />

          <AboutYou user={data.user} mutate={mutate} />

          <Auth user={data.user} />

        </>
      ) : null}

*/}

      </div>
    </>

  );
};
