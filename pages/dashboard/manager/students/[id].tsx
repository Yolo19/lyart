import React from "react";

export async function getServerSideProps(context:any) {
    const { id } = context.params;

    return {
      props: {id}
    };
  }

export default function StudentItem(props: {id: number}) {
    return <div>123</div>
}


  