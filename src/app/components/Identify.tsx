"use client";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import * as ml5 from "ml5";
import Webcam from "react-webcam";

export default function Identify() {
  const webcamRef = useRef<any>(null);
  const objectDetectorRef = useRef<any>(null);
  const [objects, setObjects] = useState<any[]>();

  useEffect(() => {
    const performObjectDetection = () => {
      if (webcamRef.current) {
        objectDetectorRef.current.detect(
          webcamRef.current.video,
          (err: any, results: any) => {
            if (err) {
              console.error(err);
            } else {
              setObjects(results);
            }

            requestAnimationFrame(performObjectDetection);
          }
        );
      }
    };
    const loadModel = async () => {
      // @ts-ignore
      objectDetectorRef.current = await ml5.objectDetector(
        "cocossd",
        {},
        modelLoaded
      );
      requestAnimationFrame(performObjectDetection);
    };

    const modelLoaded = () => {
      console.log("Model Loaded!");
    };

    loadModel();

    return () => {
      if (objectDetectorRef.current) {
        objectDetectorRef.current.removeListener();
      }
    };
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="w-full absolute flex-col gap-4 flex items-center justify-center h-screen z-10">
        {objects?.map?.((s, a) => {
          return (
            <p key={a} className=" bg-blue-500 text-white">
              {s.label}
            </p>
          );
        })}
      </div>

      <Webcam className="w-full h-screen" ref={webcamRef} muted />
    </div>
  );
}
