package org.docking.erbse.test;

public class SpliteTest 
{
	public static void main(String[] args) 
	{
		String	a = "a";
		String	b = "b";
		String	c = "c";
		
		String	res = a + "|" + b + "|" + c;
		
		String[]	ss = res.split("|");
		
		System.out.println(ss[0]);
		System.out.println(ss[1]);
		System.out.println(ss[2]);
		
		
	}
}
