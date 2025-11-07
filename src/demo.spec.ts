import { add } from "./server.ts";

 
describe("Add", () => {
   
  it("adds two numbers", () => {
     
    expect(add(1, 2)).toBe(3);
  });
});
