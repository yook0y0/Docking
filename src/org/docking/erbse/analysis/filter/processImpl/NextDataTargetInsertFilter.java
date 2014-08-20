package org.docking.erbse.analysis.filter.processImpl;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.filter.process.SingleDataProcessFilter;

public class NextDataTargetInsertFilter extends SingleDataProcessFilter{

	private byte[][] targetData;
	private byte[] insertData;
	
	private boolean targetEquals;

	public NextDataTargetInsertFilter(DockingAnalyzer stream, byte[][] srcData, byte[][] targetData, byte[] insertData, boolean targetEquals) {
		super(stream, srcData);
		this.targetData = targetData;
		this.insertData = insertData;
		this.targetEquals = targetEquals;
		// TODO Auto-generated constructor stub
	}

	public byte[][] getTargetData() {
		return targetData;
	}

	public void setTargetData(byte[][] targetData) {
		this.targetData = targetData;
	}

	public byte[] getInsertData() {
		return insertData;
	}

	public void setInsertData(byte[] insertData) {
		this.insertData = insertData;
	}

	public boolean isTargetEquals() {
		return targetEquals;
	}

	public void setTargetEquals(boolean targetEquals) {
		this.targetEquals = targetEquals;
	}

	@Override
	protected byte[] operate(byte[] data, int dataIndex, int srcIndex) {
		// TODO Auto-generated method stub

		byte[] getSrcData = super.getSrcData()[srcIndex];
		byte[] tmp = null;
		int chk = 0;
		int len = dataIndex+getSrcData.length;

		tmp = new byte[getSrcData.length];
		System.arraycopy(data, dataIndex, tmp, 0, getSrcData.length);

		for(int i=0;i<this.targetData.length;i++){
			if(this.targetData[i][0] == data[len]){
				tmp = new byte[this.targetData[i].length];
				System.arraycopy(data, len, tmp, 0, this.targetData[i].length);
				if(this.targetEquals == true){
					if(super.compare(tmp, this.targetData[i])){
						chk++;
					}
					else{
						break;
					}
				}
				else{
					if(!super.compare(tmp, this.targetData[i])){
						chk++;
					}
					else{
						break;
					}
				}
			}
		}

		if(chk == 0){
			tmp = new byte[data.length+this.insertData.length];

			System.arraycopy(data, 0, tmp, 0, len);
			System.arraycopy(this.insertData, 0, tmp, len, this.insertData.length);
			System.arraycopy(data, len, tmp, len+this.insertData.length, data.length-(len));
		}
		else{
			tmp = null;
		}

		return tmp;
	}
}
