import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "../../../../components/layout/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  List,
  Divider,
  BackTop,
  Button,
  Spin,
} from "antd";
import { fetchAllCourse } from "../../../../lib/api";
import Link from "next/link";
import CourseListItem from "../../../../components/course/courseListItem";
import { AllCourseRequest } from "../../../../lib/model/course"
//import Image from 'next/image';

export default function AllCourse() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number>();

  const loadMoreData = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);

    const requestData: AllCourseRequest = {
      currentPage: currentPage,
      pageSize: 10,
    };

    fetchAllCourse(requestData)
      .then((res) => {
        console.log(res);
        const data = res.data.data.courses;
        setTotalItems(res.data.data.total);
        setDataSource([...dataSource, ...data]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    loadMoreData();
  }, [loadMoreData]);

  return (
    <AppLayout>
      <div id="scrollableDiv" style={{ height: "80vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={dataSource.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={dataSource.length < totalItems}
          loader={<Spin size="large" spinning={loading} />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
          style={{ overflow: "hidden" }}
        >
          <List
            grid={{
              gutter: 14,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={dataSource}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <CourseListItem {...item}>
                <Link href={`/dashboard/manager/courses/${item.id}`} passHref>
                    <Button type="primary">Read More</Button>
                </Link>
                </CourseListItem> 
              </List.Item>
            )}
          />
        </InfiniteScroll>
        <BackTop
          style={{ height: "10px" }}
          target={() => {
            return document.getElementById("scrollableDiv");
          }}
        />
      </div>
    </AppLayout>
  );
}
