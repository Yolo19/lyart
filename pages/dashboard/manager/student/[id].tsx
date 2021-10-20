import React from "react";
import { fetchStudentById, fetchStudentList } from "../../../../lib/api";

export async function getServerSideProps(context) {
    const { id } = context.params;

    return {
      props: {id}
    };
  }

export default function StudentItem(props: {id: number}) {
    return <div>123</div>
}


  