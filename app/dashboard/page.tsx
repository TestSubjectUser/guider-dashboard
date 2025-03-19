import React, { Suspense } from "react";
import Main from "../../components/create-your-comp/Main";
function page() {
  return (
    <div>
      {/* <Dashboard /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Main />
      </Suspense>
    </div>
  );
}

export default page;
