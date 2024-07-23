// components/withAuth.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Do nothing while loading
      if (!session) router.push("/admin"); // Redirect if not authenticated
    }, [session, status]);

    if (session) {
      return <WrappedComponent {...props} />;
    }

    return null; // Return null while waiting for session to load
  };
};

export default withAuth;
