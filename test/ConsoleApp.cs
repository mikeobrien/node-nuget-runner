using System;
using System.Collections.Generic;

namespace ConsoleApp
{
    class Program
    {
        static int Main(string[] args)
        {
            string command = null;

            if (args.Length > 0) 
            {
                command = args[0];
                if (args.Length > 1)
                    args = new List<string>(args).GetRange(1, args.Length - 1).ToArray();
            }

            if (command == "exception") throw new Exception(  string.Join(" ", args));
            if (command == "return") 
            {
                Console.Write("Error " + args[0]);
                return int.Parse(args[0]);
            }
            if (command == "echo") Console.Write(string.Join(", ", args));
            return 0;
        }
    }
}