import { getUserData, getUserDetail } from "@/app/actions";
import InfinitCardScroll from "@/UI/InfiniteCardScroll/InfiniteScroll";

export default async function Home() {

    const userData = await getUserData();
    const ItemName = userData.data[0];
    const userItems = await getUserDetail(ItemName);
    console.log(userItems);
    async function dataFetcher(index)
    {
      'use server'
      return getUserDetail(ItemName, index, 5);
    }
  return(
    <>
    <section>
      <InfinitCardScroll dataFetcher={dataFetcher} initialItems={userItems}/>      
    </section>
    </>
  );
}
