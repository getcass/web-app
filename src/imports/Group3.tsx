import svgPaths from "./svg-vc5xxzgoh6";
import imgMidnight1 from "../assets/de3dc79ead86de6bf95cc23a50597bd6d98ddcbc.png";
import { imgGroup } from "./svg-eyfyv";

function Group() {
  return (
    <div className="absolute inset-[46.72%_58.83%_40%_33.37%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 234.122 265.683">
        <g id="Group">
          <path d={svgPaths.p2a784400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[46.72%_58.83%_40%_33.37%]" data-name="Group">
      <Group />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[46.72%_58.83%_40%_33.37%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[46.72%_49.6%_40%_41.72%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 260.341 265.683">
        <g id="Group">
          <path d={svgPaths.p7c1b380} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[46.72%_49.6%_40%_41.72%]" data-name="Group">
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[46.72%_49.6%_40%_41.72%]" data-name="Group">
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute inset-[46.72%_41.56%_40%_50.64%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 234.141 265.683">
        <g id="Group">
          <path d={svgPaths.pdbebb00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[46.72%_41.56%_40%_50.64%]" data-name="Group">
      <Group8 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[46.72%_41.56%_40%_50.64%]" data-name="Group">
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute inset-[46.72%_33.39%_40%_58.81%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 234.141 265.683">
        <g id="Group">
          <path d={svgPaths.p178c580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[46.72%_33.39%_40%_58.81%]" data-name="Group">
      <Group11 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[46.72%_33.39%_40%_58.81%]" data-name="Group">
      <Group12 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-[40.03%_47.42%_53.32%_47.51%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.958px_-0.522px] mask-size-[154.276px_133.133px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 152.152 133.026">
        <g id="Group">
          <path d={svgPaths.p2a54b300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[40%_47.38%_53.34%_47.48%]" data-name="Clip path group">
      <Group14 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[40%_33.39%_40%_33.37%]">
      <Group4 />
      <Group7 />
      <Group10 />
      <Group13 />
      <ClipPathGroup />
    </div>
  );
}

export default function Group3() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[2000px] left-0 top-0 w-[3000px]" data-name="midnight 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMidnight1} />
      </div>
      <Group2 />
    </div>
  );
}