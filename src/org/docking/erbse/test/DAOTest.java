package org.docking.erbse.test;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.MemberVO;

public class DAOTest
{	
	public static void main(String[] args) 
	{
		GenericService<EditorCodeVO>	service = new GenericServiceImpl<EditorCodeVO>();
		
		EditorCodeVO	ecvo = new EditorCodeVO();
		List<EditorCodeVO> ecvoList = new ArrayList<EditorCodeVO>();
		
		for(int i=0;i<10;i++){
		ecvo.setCode(String.valueOf(i));
		ecvo.setEditorId(String.valueOf(i));
		ecvo.setPath(String.valueOf(i));
		ecvoList.add(ecvo);
		}
		
		System.out.println(ecvoList);
		
		//System.out.println(service.add("editorCode_add", ecvoList));
	}
}
