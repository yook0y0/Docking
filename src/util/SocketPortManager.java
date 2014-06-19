package util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SocketPortManager {

	public static int minNum = 9000;
	public static int maxNum = 10000;

	public static int portList = 0;
	public static int usePortList = 1;

	private Map<Integer,List<Integer>> portMap;

	private static SocketPortManager instance;
	static
	{
		instance = new SocketPortManager();
	}

	private SocketPortManager(){
		portMap = new HashMap<Integer,List<Integer>>();

		List<Integer> li = new ArrayList<Integer>();
		List<Integer> useLi = new ArrayList<Integer>();
		for(int i=minNum;i<maxNum;i++){
			li.add(i);
		}
		portMap.put(portList, li);
		portMap.put(usePortList, useLi);
	}

	public static SocketPortManager getInstance()
	{
		return instance;
	}

	public int getPort(){
		int num = this.portMap.get(portList).get(0);
		this.portMap.get(portList).remove(0);
		this.portMap.get(usePortList).add(num);
		return num;
	}
	public void setPort(int port){
		for(int i=0;i<this.portMap.get(usePortList).size();i++){
			if(this.portMap.get(usePortList).get(i).equals(port)){
				this.portMap.get(usePortList).remove(i);
				this.portMap.get(portList).add(port);
			}
		}
	}
}
