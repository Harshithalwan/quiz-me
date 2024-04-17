import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const { push } = useRouter();
  return (
    <div className="absolute top-0 py-2 px-4 bg-gray-700 left-0 w-screen overflow-hidden max-w-full">
      {/* <img src="quizmeLogo.png"></img> */}
      <Image
        width={130}
        height={100}
        src={"/quizmeLogo.png"}
        alt={"logo"}
        onClick={() => push("/")}
        className="cursor-pointer"
      />
    </div>
  );
};

export default Header;
