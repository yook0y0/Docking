package org.docking.erbse.analysis.filter.processImpl;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.filter.process.SingleDataProcessFilter;

public class SingleDataUpdateFilter extends SingleDataProcessFilter {

	private byte[][] updateData;
	
	public SingleDataUpdateFilter(DockingAnalyzer stream, byte[][] targetData, byte[][] updateData) {
		super(stream,targetData);
		this.updateData = updateData;
		// TODO Auto-generated constructor stub
	}
	
	public byte[][] getUpdateData(){
		return this.updateData;
	}
	
	public void setUpdateData(byte[][] updateData){
		this.updateData = updateData;
	}

	protected byte[] operate(byte[] data, int dataIndex, int srcIndex){
		
		byte[] targetData = super.getTargetData()[srcIndex];
		
		byte[] tmp = new byte[data.length+this.updateData[srcIndex].length-targetData.length];
		
		System.arraycopy(data, 0, tmp, 0, dataIndex);
		System.arraycopy(this.updateData[srcIndex], 0, tmp, dataIndex, this.updateData[srcIndex].length);
		System.arraycopy(data, dataIndex+targetData.length, tmp, dataIndex+this.updateData[srcIndex].length, data.length-(dataIndex+targetData.length));

		return tmp;
	}
}
