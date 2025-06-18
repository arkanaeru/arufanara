import Image from "next/image";
import NotFoundImage from "../assets/notfound.svg";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-12 duration-300 bg-white dark:bg-dark">
      <Image src={NotFoundImage} alt="not found"  width={200}   // tambahkan ini
  height={60}  className="max-w-[400px] " />
      <h1 className="text-3xl font-bold text-center dark:text-white">
        Page Not Found
      </h1>
    </div>
  );
}
