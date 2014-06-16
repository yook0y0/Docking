package test;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.servlet.ServletOutputStream;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileReaderFilter;
import analysis.filter.FileUnzipFilter;
import analysis.register.FilePathRegister;

public class TestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		String filePath = "C:\\test\\doc_write.zip";

		DockingAnalyzer ds = new FileUnzipFilter(new FilePathRegister(filePath));
		ds.analyze();

		DataAttribute dAttr = (DataAttribute) ds.getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();

		byte[] buffer = new byte[1024];

		try {
			String path = "C:\\test\\doc_write.png"; // 그림 파일 위치 파악.
			File file = new File(path);
			// 그림 파일을 읽기 위한 객체 생성.
			BufferedInputStream in = new BufferedInputStream(new FileInputStream(file)); 
			int n = 0;

			// 파일 내용을 읽고, 이것을 ServletOutputStream을 통해서 출력. 
			while((n=in.read(buffer)) != -1) {
				for(int i=0;i<data[0].length;i++){
					System.out.println(data[0][i] + " / " + buffer[i]);
				}
			}

			in.close();
		}catch(Exception e) {}
	}

}
