package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingStream;

public abstract class PostDataProcessFilter extends DataProcessFilter {

	private byte[][] targetData;

	public PostDataProcessFilter(DockingStream stream, byte[][] targetData) {
		super(stream);
		this.targetData = targetData;
		// TODO Auto-generated constructor stub
	}

	private byte[][] getTargetData(){
		return this.targetData;
	}

	private void setTargetData(byte[][] targetData){
		this.targetData = targetData;
	}

	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth,
			List<Integer> endWidth) {
		byte[] dataTmp = data;
		byte[] tmp = dataTmp;

		boolean cmp = false;
		int valCnt = 0;

		for(int i=0;i<dataTmp.length;i++){
			for(int j=0;j<this.targetData.length;j++){
				if(dataTmp[i] == this.targetData[j][0]){
					tmp = new byte[this.targetData[j].length];
					System.arraycopy(this.targetData[j], 0, tmp, 0, this.targetData[j].length);
					cmp = this.compare(tmp, this.targetData[j]);

					if(cmp == true){
						tmp = this.operate(/*dataTmp, i, j, valCnt*/);

						startWidth.add(i);
						endWidth.add(i+valCnt);
					}
				}
			}
			dataTmp = tmp;
		}

		return dataTmp;
	}
	
	abstract protected byte[] operate(/*byte[] data, int dataIndex, int srcIndex, int targetIndex*/);
}